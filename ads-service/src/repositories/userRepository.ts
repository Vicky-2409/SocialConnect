import { Types } from "mongoose";
import userCollection, { IUser } from "../models/userCollection";
import { MESSAGES } from "../utils/constants";
import logger from "../utils/logger";

export interface IUserRepository {
  addUser(userData: IUser): Promise<string>;
  getUser(userId: string | Types.ObjectId): Promise<IUser>;
  updateUser(userData: IUser): Promise<string>;
  getUserDataByEmail(email: string): Promise<IUser>;
}

export default class UserRepository implements IUserRepository {
  async addUser(userData: IUser): Promise<string> {
    try {
      logger.info("Adding a new user", { userData });

      userData._id = new Types.ObjectId(userData._id);
      await userCollection.create(userData);
      logger.info("User added successfully", { userId: userData._id });

      return MESSAGES.SUCCESS.USER_ADDED;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getUser(userId: string | Types.ObjectId): Promise<IUser> {
    try {
      logger.info("Fetching user", { userId });

      let _id;
      if (typeof userId === "string") {
        _id = new Types.ObjectId(userId);
      } else {
        _id = userId;
      }
      const userData = await userCollection.findOne(_id);
      if (!userData) {
        logger.warn("User not found", { userId });
        throw new Error(MESSAGES.ERRORS.USER_NOT_FOUND);
      }
      logger.info("User fetched successfully", { userId });
      return userData;
    } catch (error: any) {
      logger.error("Error fetching user", { error: error.message });
      throw new Error(error.message);
    }
  }
  async updateUser(userData: IUser): Promise<string> {
    try {
      logger.info("Updating user", { userId: userData._id });
      const _id = new Types.ObjectId(userData._id);
      const user: any = await userCollection.findOne({ _id });
      if (!user) {
        logger.warn("User not found for update", { userId: userData._id });
        throw new Error(MESSAGES.ERRORS.USER_NOT_FOUND);
      }

      const updatedUser = {
        ...user._doc,
        ...userData,
      };
      await userCollection.findOneAndUpdate({ _id }, { $set: updatedUser });
      logger.info("User updated successfully", { userId: userData._id });
      return MESSAGES.SUCCESS.USER_UPDATED;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getUserDataByEmail(email: string): Promise<IUser> {
    try {
      logger.info("Fetching user by email", { email });
      const userData = await userCollection.findOne({ email });
      if (!userData) {
        logger.warn("User data not found by email", { email });
        throw new Error(MESSAGES.ERRORS.USER_DATA_NOT_FOUND);
      }
      logger.info("User fetched successfully by email", { email });
      return userData;
    } catch (error: any) {
      logger.error("Error fetching user by email", { error: error.message });
      throw new Error(error.message);
    }
  }
}
