import {Types} from "mongoose";
import { IUser } from "../models/userCollection";
import {IUserRepository} from "../repositories/userRepository";

export interface IUserService {
  addUser(userData: IUser): Promise<string>; // Add a new user
  getUser(userId: string | Types.ObjectId): Promise<IUser>; // Retrieve user by ID
  updateUser(userData: IUser): Promise<string>; // Update user data
}

export default class UserService implements IUserService{
  private userRepository: IUserRepository
  constructor(userRepository: IUserRepository){
    this.userRepository= userRepository
  }
  async addUser (userData: IUser): Promise<string> {
    try {
      return await this.userRepository.addUser(userData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getUser(userId: string | Types.ObjectId): Promise<IUser> {
    try {
      return await this.userRepository.getUser(userId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async updateUser(userData: IUser): Promise<string> {
    try {
      return await this.userRepository.updateUser(userData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}


