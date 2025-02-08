import { OTPCollection } from "../models/OTP";
import userCollection, { IUser } from "../models/User";
import wenetTickRequestCollection from "../models/WenetTickRequest";
import { OTPHelper } from "../utils/OTPHelper";
import hash from "../utils/hash";
import halfwayUser from "../utils/isHalfwayUser";
import jwt from "jsonwebtoken";
import { JwtPayload, jwtDecode } from "jwt-decode";
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

dotenv.config();

export default class UserRepository implements IUserRepository {
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
      const user = new userCollection(userData);
      return await user.save();
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async addUserData(userData: IUser): Promise<IUser> {
    try {
      const { _id, email, dateOfBirth, gender } = userData;
      const user = await userCollection.findOne({ _id });
      if (!user) throw new Error(UserErrorMsg.NO_USER);
      user.email = email;
      user.dateOfBirth = dateOfBirth;
      user.gender = gender;

      if (user.gender === "male") user.profilePicUrl = DEFAULT_PROFILE_PIC_MALE;
      else user.profilePicUrl = DEFAULT_PROFILE_PIC_FEMALE;

      return await user.save();
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async sendOTP(email: string): Promise<string> {
    try {
      let otp = OTPHelper.generateOTP();
      const user = await userCollection.findOne({ email });

      const existingOtp = await OTPCollection.findOne({ _id: user?._id });
      if (existingOtp) {
        existingOtp.otp = hash.hashString(otp);
        await existingOtp.save();
      } else {
        await OTPCollection.insertMany([
          { _id: user?._id, otp: hash.hashString(otp) },
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
      const otpFromDb: any = await OTPCollection.findOne({ _id });
      if (!otpFromDb) throw new Error(GeneralErrorMsg.OTP_ERROR);

      const timeNow = new Date().getTime();
      const otpUpdatedAt = new Date(otpFromDb.updatedAt).getTime();
      const isWithinLimit = (timeNow - otpUpdatedAt) / 1000 < OTP_TIME_LIMIT;
      if (!isWithinLimit) throw new Error(GeneralErrorMsg.TIME_LIMIT_EXCEED);

      const isVerified = hash.compareHash(otp, otpFromDb.otp);
      if (isVerified) {
        const user = await userCollection.findOne({ _id });
        if (!user) throw new Error(UserErrorMsg.NO_USER);
        user.isRestricted = false;
        await user?.save();

        return ResponseMsg.OTP_VERIFIED;
      } else {
        throw new Error(GeneralErrorMsg.INVALID_OTP);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async verifyLogin(username: string, password: string): Promise<IUser> {
    try {
      const user = await userCollection.findOne({ username });
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
      const user = await userCollection.findById(userData._id);
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
      const user = await userCollection.findOne({ _id: userId });
      if (!user) throw new Error(UserErrorMsg.NO_USER);

      const passwordMatches = hash.compareHash(currentPassword, user.password);
      if (!passwordMatches) throw new Error(INVALID_CREDENTIALS_MSG);

      user.password = hash.hashString(newPassword);
      await user.save();

      return PASSWORD_CHANGED_MSG;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async forgotPassword(email: string): Promise<string> {
    try {
      const user = await userCollection.findOne({ email: email });
      if (!user) throw new Error(EMAIL_NOT_FOUND_MSG);

      const newPassword = generateStrongPassword();

      await OTPHelper.sendPassword(email, newPassword);

      user.password = hash.hashString(newPassword);
      await user.save();

      return "New password is send to your email";
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changeAccountType(
    userId: string,
    accountType: "personalAccount" | "celebrity" | "company"
  ): Promise<IUser> {
    try {
      const user = await userCollection.findOne({ _id: userId });

      await wenetTickRequestCollection.deleteOne({ userId: user?._id });

      if (!user) {
        throw new Error(UserErrorMsg.NO_USER);
      }

      if (accountType === "personalAccount") {
        user.accountType = {
          isProfessional: false,
          hasWeNetTick: false,
        };
      } else {
        user.accountType = {
          isProfessional: true,
          category: accountType,
          hasWeNetTick: false,
        };
      }
      await user.save();

      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // async requestWenetTick(
  //   userId: string,
  //   imageUrl: string,
  //   description: string
  // ) {
  //   try {
  //     return await wenetTickRequestCollection.create({
  //       userId: new Types.ObjectId(userId),
  //       imageUrl,
  //       description,
  //     });
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  async requestWenetTick(
    userId: string,
    imageUrl: string,
    description: string
  ) {
    try {
      const verifiedTickData = await wenetTickRequestCollection.findOne({ userId });
  
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

  // restrictUser: async (userId: string): Promise<string> => {
  //   try {
  //     // Find the user by ID
  //     const user = await userCollection.findOne({ _id: userId });

  //     if (!user) {
  //       throw new Error("User not found");
  //     }

  //     // Set the restriction for 7 days
  //     const restrictedUntil = new Date();
  //     restrictedUntil.setDate(restrictedUntil.getDate() + 7);

  //     // Update the user's restriction fields
  //     const updateResult = await userCollection.updateOne(
  //       { _id: userId },
  //       {
  //         $set: {
  //           restrictedFromPostingUntil: restrictedUntil,
  //         },
  //       }
  //     );

  //     if (updateResult.modifiedCount === 0) {
  //       throw new Error("Failed to update user restriction status");
  //     }

  //     return "User successfully restricted from posting.";
  //   } catch (error: any) {
  //     console.error("Error:", error); // Log error details
  //     throw new Error(error.message);
  //   }
  // }

  async restrictUser(userId: string): Promise<IUser> {
    try {
      // Find the user by ID
      const user = await userCollection.findOne({ _id: userId });

      if (!user) {
        throw new Error(UserErrorMsg.NO_USER);
      }

      // Set the restriction for 7 days
      const restrictedUntil = new Date();
      restrictedUntil.setDate(restrictedUntil.getDate() + 7);

      // Update the user's restriction fields
      const updateResult = await userCollection.updateOne(
        { _id: userId },
        {
          $set: {
            restrictedFromPostingUntil: restrictedUntil,
          },
        }
      );

      if (updateResult.modifiedCount === 0) {
        throw new Error("Failed to update user restriction status");
      }

      // Fetch the updated document
      const updatedUser = await userCollection.findOne({ _id: userId });

      if (!updatedUser) {
        throw new Error("Failed to retrieve updated user");
      }

      return updatedUser;
    } catch (error: any) {
      console.error("Error:", error); // Log error details
      throw new Error(error.message);
    }
  }

  // blockUser: async (userId: string): Promise<IUser> => {
  //   try {
  //     // Find the user by ID
  //     const user = await userCollection.findOne({ _id: userId });

  //     if (!user) {
  //       throw new Error("User not found");
  //     }

  //     // Update the user's restriction fields
  //     const updateResult = await userCollection.updateOne(
  //       { _id: userId },
  //       {
  //         $set: {
  //           isRestricted: true,
  //         },
  //       }
  //     );

  //     if (updateResult.modifiedCount === 0) {
  //       throw new Error("Failed to update user restriction status");
  //     }

  //     // Fetch the updated document
  //     const updatedUser = await userCollection.findOne({ _id: userId });

  //     if (!updatedUser) {
  //       throw new Error("Failed to retrieve updated user");
  //     }

  //     return updatedUser;
  //   } catch (error: any) {
  //     console.error("Error:", error); // Log error details
  //     throw new Error(error.message);
  //   }
  // }

  async blockUser(username: string): Promise<IUser> {
    try {
      // Find the user by username
      const user = await userCollection.findOne({ username });

      if (!user) {
        throw new Error("User not found");
      }

      // Toggle the user's restriction status
      const updateResult = await userCollection.updateOne(
        { username },
        { $set: { isRestricted: !user.isRestricted } } // Toggle isRestricted value
      );

      if (updateResult.modifiedCount === 0) {
        throw new Error(
          "Failed to update user restriction status. The user might already be in the desired state."
        );
      }

      // Fetch the updated user document
      const updatedUser = await userCollection.findOne({ username });

      if (!updatedUser) {
        throw new Error(
          "Failed to retrieve updated user data after restriction"
        );
      }

      // Successfully updated and returned the user
      return updatedUser;
    } catch (error: any) {
      console.error("Error blocking user:", error.message); // Detailed log for the server
      // Throw the error with a message for the API response (if needed)
      throw new Error(
        error?.message ||
          "An unexpected error occurred while blocking the user."
      );
    }
  }
}
