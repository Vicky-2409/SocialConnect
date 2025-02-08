// import userRepository from "../repositories/userRepository";
import { IUser } from "../models/User";
import { MQActions } from "../rabbitMq/config";
import {
  IGoogleCredentialRes,
  IUserRepository,
  IUserService,
} from "../types/types";
import { UserErrorMsg } from "../utils/constants";

export default class UserService implements IUserService {
  private userRepository: IUserRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async addUser(userData: IUser): Promise<IUser> {
    try {
      return await this.userRepository.addUser(userData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async findUser(userData: IUser): Promise<IUser> {
    try {
      return await this.userRepository.findUser(userData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addUserData(userData: IUser): Promise<IUser> {
    try {
      const user = await this.userRepository.addUserData(userData);
      await this.sendOTP(user?.email);
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async sendOTP(email: string): Promise<string> {
    try {
      return await this.userRepository.sendOTP(email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async reSendOTP(userData: IUser): Promise<string> {
    try {
      const user = await this.findUser(userData);
      if (!user) throw new Error(UserErrorMsg.NO_USER);
      return await this.userRepository.sendOTP(user?.email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async verifyOTP(_id: string, otp: string): Promise<string> {
    try {
      const isVerified = await this.userRepository.verifyOTP(_id, otp);
      try {
        await this.sendUserDataToMQ(_id, MQActions.addUser);

        //userData with email, to ads Service
        await this.sendUserDataToAdsMQ(_id, MQActions.addUser);
      } catch (error: any) {
        console.log(error.message);
      }

      return isVerified;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async verifyLogin(username: string, password: string): Promise<IUser> {
    try {
      return await this.userRepository.verifyLogin(username, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async generateJWT(userData: IUser): Promise<string> {
    try {
      return await this.userRepository.generateJWT(userData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async generateRefreshJWT(userData: IUser): Promise<string> {
    try {
      return await this.userRepository.generateRefreshJWT(userData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async googleSignin(
    credentialResponse: IGoogleCredentialRes
  ): Promise<{ user: IUser; exisitngUser: boolean }> {
    try {
      const { user, exisitngUser } = await this.userRepository.googleSignin(
        credentialResponse
      );

      const action = exisitngUser ? MQActions.editUser : MQActions.addUser;

      await this.sendUserDataToMQ(String(user._id), action);
      await this.sendUserDataToAdsMQ(String(user._id), action);

      return { user, exisitngUser };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async sendUserDataToMQ(_id: string, action: string): Promise<void> {
    try {
      await this.userRepository.sendUserDataToMQ(_id, action);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async sendUserDataToAdsMQ(_id: string, action: string): Promise<void> {
    try {
      await this.userRepository.sendUserDataToAdsMQ(_id, action);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<string> {
    try {
      return await this.userRepository.changePassword(
        userId,
        currentPassword,
        newPassword
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async forgotPassword(email: string): Promise<string> {
    try {
      return await this.userRepository.forgotPassword(email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changeAccountType(userId: string, accountType: string): Promise<IUser> {
    try {
      if (!userId) throw new Error("userId not found");
      if (
        accountType != "personalAccount" &&
        accountType != "celebrity" &&
        accountType != "company"
      )
        throw new Error("Enter valid account type");

      return await this.userRepository.changeAccountType(userId, accountType);
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
      return await this.userRepository.requestWenetTick(
        userId,
        imageUrl,
        description
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async hasRequestedTick(userId: string) {
    try {
      const tickRequestData = await this.userRepository.getTickRequestData(
        userId
      );
      if (!tickRequestData) return { hasRequestedTick: false, status: null };

      return { hasRequestedTick: true, status: tickRequestData.status };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async hasWenetTick(username: string) {
    try {
      const user = await this.userRepository.getUserData(username);
      if (!user) throw new Error("User not found");

      if (user.accountType?.hasWeNetTick) return true;
      else return false;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async restrictUser(userId: string): Promise<IUser> {
    try {

      const response = await this.userRepository.restrictUser(userId);



      if (response) {
        try {
          await this.userRepository.sendRestrictNotificationToMQ(
            response._id.toString(),
            response._id.toString(),
            "restrict",
            "You are restricted for posting content for 7 days",
            "users",
            response._id.toString()
          );
        } catch (error: any) {
          console.log(error.message);
        }
      }

      try {
        await this.sendUserDataToMQ(userId, MQActions.editUser);
      } catch (error: any) {
        console.log(error.message);
      }

      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async blockUser(username: string): Promise<IUser> {
    try {
      const userData = await this.userRepository.blockUser(username);

      try {
        await this.sendUserDataToMQ(String(userData._id), MQActions.editUser);
      } catch (error: any) {
        console.log(error.message);
      }

      return userData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
