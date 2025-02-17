import { OTPCollection } from "../models/OTP";
import userCollection, { IUser } from "../models/User";
import wenetTickRequestCollection from "../models/WenetTickRequest";
import { OTPHelper } from "../utils/OTPHelper";
import hash from "../utils/hash";
import halfwayUser from "../utils/isHalfwayUser";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import dotenv from "dotenv";
import { IGoogleCredentialRes, IUserRepository } from "../types/types";
import "core-js/stable/atob";
import mongoose, { Types } from "mongoose";
import { generateStrongPassword } from "../utils/generateStrongPassword";
import {
  MQUserData,
  MQUserDataToAds,
  publisher,
  MQINotification,
} from "../rabbitMq/publisher";
import { userServiceProducers, MQActions } from "../rabbitMq/config";
import {
  DEFAULT_PROFILE_PIC_FEMALE,
  DEFAULT_PROFILE_PIC_MALE,
  EMAIL_NOT_FOUND_MSG,
  EnvErrorMsg,
  GeneralErrorMsg,
  INVALID_CREDENTIALS_MSG,
  JwtErrorMsg,
  OTP_SENT_MSG,
  OTP_TIME_LIMIT,
  PASSWORD_CHANGED_MSG,
  ResponseMsg,
  Role,
  TEMP_PASSWORD,
  UserErrorMsg,
} from "../utils/constants";
import { BaseRepository } from "./baseRepository";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

export default class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(userCollection);
  }

  async addUser(userData: IUser): Promise<IUser> {
    try {
      userData.password = hash.hashString(userData.password);
      const isHalfwayUser = await halfwayUser.isHalfwayUser(userData);
      if (isHalfwayUser) {
        const { firstName, lastName, password } = userData;
        isHalfwayUser.firstName = firstName;
        isHalfwayUser.lastName = lastName;
        isHalfwayUser.password = hash.hashString(password);
        return await isHalfwayUser.save();
      }
      userData.isRestricted = true;
      return await this.create(userData);
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async addUserData(userData: IUser): Promise<IUser> {
    try {
      const { _id, email, dateOfBirth, gender } = userData;
      const user = await this.findById(String(_id));
      if (!user) throw new Error(UserErrorMsg.NO_USER);

      const updateData = {
        email,
        dateOfBirth,
        gender,
        profilePicUrl:
          gender === "male"
            ? DEFAULT_PROFILE_PIC_MALE
            : DEFAULT_PROFILE_PIC_FEMALE,
      };

      const updatedUser = await this.update(String(_id), updateData);
      if (!updatedUser) {
        throw new Error(UserErrorMsg.UPDATE_FAILED);
      }
      return updatedUser;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async sendOTP(email: string): Promise<string> {
    try {
      let otp = OTPHelper.generateOTP();
      const user = await this.findOne({ email });
      if (!user) throw new Error(UserErrorMsg.NO_USER);

      const existingOtp = await OTPCollection.findOne({ _id: user._id });
      if (existingOtp) {
        existingOtp.otp = hash.hashString(otp);
        await existingOtp.save();
      } else {
        await OTPCollection.insertMany([
          { _id: user._id, otp: hash.hashString(otp) },
        ]);
      }

      await OTPHelper.sendMail(email, otp);
      return OTP_SENT_MSG;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async verifyOTP(_id: string, otp: string): Promise<string> {
    try {
      const otpFromDb = await OTPCollection.findOne({ _id });
      if (!otpFromDb) throw new Error(GeneralErrorMsg.OTP_ERROR);

      const timeNow = new Date().getTime();
      const otpUpdatedAt =
        otpFromDb && "updatedAt" in otpFromDb
          ? new Date((otpFromDb as any).updatedAt).getTime()
          : Date.now();

      const isWithinLimit = (timeNow - otpUpdatedAt) / 1000 < OTP_TIME_LIMIT;
      if (!isWithinLimit) throw new Error(GeneralErrorMsg.TIME_LIMIT_EXCEED);

      const isVerified = hash.compareHash(otp, otpFromDb.otp);
      if (!isVerified) throw new Error(GeneralErrorMsg.INVALID_OTP);

      const user = await this.findById(_id);
      if (!user) throw new Error(UserErrorMsg.NO_USER);

      return await this.update(_id, { isRestricted: false }).then(
        () => ResponseMsg.OTP_VERIFIED
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async verifyLogin(username: string, password: string): Promise<IUser> {
    try {
      const user = await this.findOne({ username });
      if (!user) throw new Error(INVALID_CREDENTIALS_MSG);

      if (user.isRestricted) throw new Error(GeneralErrorMsg.USER_RESTRICTED);

      const passwordMatches = hash.compareHash(password, user.password);
      if (!passwordMatches) throw new Error(INVALID_CREDENTIALS_MSG);

      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async findUser(userData: IUser): Promise<IUser> {
    try {
      const user = await this.findById(String(userData._id));
      if (!user) throw new Error(GeneralErrorMsg.SIGN_UP_AGAIN);
      return user;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async generateJWT(userData: IUser): Promise<string> {
    try {
      const secret: string | undefined = process.env.JWT_SECRET;

      if (!secret) throw new Error(EnvErrorMsg.JWT_NOT_FOUND);
      const data = { userData, role: Role.User };
      return jwt.sign(data, secret, {
        expiresIn: JwtErrorMsg.JWT_EXPIRATION,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async generateRefreshJWT(userData: IUser): Promise<string> {
    try {
      const secret: string | undefined = process.env.JWT_SECRET;

      if (!secret) throw new Error(EnvErrorMsg.JWT_NOT_FOUND);
      const data = { userData, role: Role.User };
      return jwt.sign(data, secret, {
        expiresIn: JwtErrorMsg.JWT_REFRESH_EXPIRATION,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async googleSignin(
    credentialResponse: IGoogleCredentialRes
  ): Promise<{ user: IUser; exisitngUser: boolean }> {
    try {
      const { credential } = credentialResponse;
      const decodedCredential: any = jwtDecode<JwtPayload>(credential);

      const {
        email,
        given_name: firstName,
        family_name: lastName,
        picture: profilePicUrl,
      } = decodedCredential;

      //logic for email already exists
      //grab the user data and sign it using JWT & send
      let user = await userCollection.findOne({ email });
      if (user) return { user, exisitngUser: true };

      //logic for email doesn't exist
      // create a new user with email, name and generate random username
      //grab and sign it using JWT & send
      const userData = {
        email,
        firstName,
        lastName,
        profilePicUrl,
        username: `${firstName}${lastName}`, //handle username later
        password: TEMP_PASSWORD, //handle password later- giving empty string as of now
      };
      user = new userCollection(userData);
      const userDataToReturn = await user.save();
      return { user: userDataToReturn, exisitngUser: false };
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async sendUserDataToMQ(_id: string, action: string) {
    try {
      const objectId = new mongoose.Types.ObjectId(_id);
      const user = await userCollection.findOne({ _id: objectId });

      if (!user) {
        throw new Error(UserErrorMsg.NO_USER);
      }

      //user data to publish:
      const {
        username,
        firstName,
        lastName,
        profilePicUrl,
        restrictedFromPostingUntil,
        isRestricted,
      } = user;
      const date = new Date();
      const userData: MQUserData = {
        _id: user._id,
        username,
        firstName,
        lastName,
        profilePicUrl: profilePicUrl ? profilePicUrl : "",
        restrictedFromPostingUntil: restrictedFromPostingUntil
          ? restrictedFromPostingUntil
          : date.getDate(),
        isRestricted: isRestricted ? isRestricted : false,
      };
      userServiceProducers.forEach(async (routingKey) => {
        if (routingKey != userServiceProducers[3])
          await publisher.publishUserMessage(userData, action, routingKey);
      });
    } catch (error: any) {
      console.error("Error sending user data to MQ:", error.message);
      throw new Error(error.message);
    }
  }

  async sendUserDataToAdsMQ(_id: string, action: string) {
    try {
      const objectId = new mongoose.Types.ObjectId(_id);
      const user = await userCollection.findOne({ _id: objectId });

      if (!user) {
        throw new Error(UserErrorMsg.NO_USER);
      }

      //user data to publish:
      const { username, firstName, lastName, profilePicUrl, email } = user;
      const userData: MQUserDataToAds = {
        _id: user._id,
        username,
        firstName,
        lastName,
        profilePicUrl: profilePicUrl ? profilePicUrl : "",
        email,
      };
      await publisher.publishUserMessageToAds(userData, action);
    } catch (error: any) {
      console.error("Error sending user data to MQ:", error.message);
      throw new Error(error.message);
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<string> {
    try {
      const user = await this.findById(userId);
      if (!user) throw new Error(UserErrorMsg.NO_USER);

      const passwordMatches = hash.compareHash(currentPassword, user.password);
      if (!passwordMatches) throw new Error(INVALID_CREDENTIALS_MSG);

      await this.update(userId, { password: hash.hashString(newPassword) });
      return PASSWORD_CHANGED_MSG;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async forgotPassword(email: string): Promise<string> {
    try {
      const user = await this.findOne({ email });
      if (!user) throw new Error(EMAIL_NOT_FOUND_MSG);

      const newPassword = generateStrongPassword();
      await OTPHelper.sendPassword(email, newPassword);

      await this.update(String(user._id), {
        password: hash.hashString(newPassword),
      });
      return "New password is sent to your email";
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changeAccountType(
    userId: string,
    accountType: "personalAccount" | "celebrity" | "company"
  ): Promise<IUser> {
    try {
      const user = await this.findById(userId);
      if (!user) throw new Error(UserErrorMsg.NO_USER);

      await wenetTickRequestCollection.deleteOne({ userId: user._id });

      const accountTypeData =
        accountType === "personalAccount"
          ? { isProfessional: false, hasWeNetTick: false }
          : {
              isProfessional: true,
              category: accountType,
              hasWeNetTick: false,
            };

      const updatedUser = await this.update(userId, {
        accountType: accountTypeData,
      });
      if (!updatedUser) {
        throw new Error(UserErrorMsg.UPDATE_FAILED);
      }
      return updatedUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async requestWenetTick(
    userId: string,
    imageUrl: string,
    description: string
  ) {
    try {
      const verifiedTickData = await wenetTickRequestCollection.findOne({
        userId,
      });

      if (verifiedTickData) {
        return await wenetTickRequestCollection.findOneAndUpdate(
          { userId },
          { $set: { status: "pending", imageUrl, description } },
          { new: true, returnDocument: "after" } // Ensures the updated document is returned
        );
      }

      return await wenetTickRequestCollection.create({
        userId: new Types.ObjectId(userId),
        imageUrl,
        description,
        status: "pending",
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getTickRequestData(userId: string) {
    try {
      return await wenetTickRequestCollection.findOne({
        userId: new Types.ObjectId(userId),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async sendRestrictNotificationToMQ(
    userId: string | Types.ObjectId,
    doneByUser: string | Types.ObjectId,
    type: "restrict" | "approved",
    notificationMessage: string,
    entityType: "users",
    entityId: string | Types.ObjectId
  ) {
    try {
      //notification data to publish:
      const notificationData: MQINotification = {
        userId,
        doneByUser,
        type,
        notificationMessage,
        entityType,
        entityId,
      };
      await publisher.publishNotificationMessage(
        notificationData,
        MQActions.addNotification
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getUserData(username: string) {
    try {
      return await userCollection.findOne({ username });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async restrictUser(userId: string): Promise<IUser> {
    try {
      const user = await this.findById(userId);
      if (!user) throw new Error(UserErrorMsg.NO_USER);

      const restrictedUntil = new Date();
      restrictedUntil.setDate(restrictedUntil.getDate() + 7);

      const updatedUser = await this.update(userId, {
        restrictedFromPostingUntil: restrictedUntil,
      });
      if (!updatedUser) {
        throw new Error(UserErrorMsg.UPDATE_FAILED);
      }

      return updatedUser;
    } catch (error: any) {
      console.error("Error:", error);
      throw new Error(error.message);
    }
  }

  async blockUser(username: string): Promise<IUser> {
    try {
      const user = await this.findOne({ username });
      if (!user) throw new Error(UserErrorMsg.NO_USER);
      const updatedUser = await this.update(String(user._id), {
        isRestricted: !user.isRestricted,
      });
      if (!updatedUser) {
        throw new Error(UserErrorMsg.UPDATE_FAILED);
      }
      return updatedUser;
    } catch (error: any) {
      console.error("Error blocking user:", error.message);
      throw new Error(
        error.message || "An unexpected error occurred while blocking the user."
      );
    }
  }
}
