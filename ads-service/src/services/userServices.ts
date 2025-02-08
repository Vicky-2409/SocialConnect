import { Types } from "mongoose";
import { IUser } from "../models/userCollection";
import { IUserRepository } from "../repositories/userRepository";
import logger from "../utils/logger";

export interface IUserService {
  addUser(userData: IUser): Promise<string>;
  getUser(userId: string | Types.ObjectId): Promise<IUser>;
  updateUser(userData: IUser): Promise<string>;
  getUserDataByEmail(email: string): Promise<IUser>;
}

export default class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async addUser(userData: IUser): Promise<string> {
    try {
      logger.info("Adding user", { userData });

      return await this.userRepository.addUser(userData);
    } catch (error: any) {
      logger.error(`Error in addUser: ${error.message}`, { error });
      throw new Error(error.message);
    }
  }
  async getUser(userId: string | Types.ObjectId): Promise<IUser> {
    try {
      logger.info("Fetching user data", { userId });
      return await this.userRepository.getUser(userId);
    } catch (error: any) {
      logger.error(`Error in getUser: ${error.message}`, { error });
      throw new Error(error.message);
    }
  }
  async updateUser(userData: IUser): Promise<string> {
    try {
      logger.info("Updating user", { userData });
      return await this.userRepository.updateUser(userData);
    } catch (error: any) {
      logger.error(`Error in updateUser: ${error.message}`, { error });
      throw new Error(error.message);
    }
  }
  async getUserDataByEmail(email: string): Promise<IUser> {
    try {
      logger.info("Fetching user data by email", { email });
      return await this.userRepository.getUserDataByEmail(email);
    } catch (error: any) {
      logger.error(`Error in getUserDataByEmail: ${error.message}`, { error });
      throw new Error(error.message);
    }
  }
}
