import {Types} from "mongoose";
import { IUser } from "../models/userCollection";
import {IUserRepository} from "../repositories/userRepository";
import { MESSAGES } from "../utils/constants";


export interface IUserService {
  addUser(userData: IUser): Promise<string>;
  getUser(userId: string | Types.ObjectId): Promise<IUser>;
  updateUser(userData: IUser): Promise<string>;
}



export default class UserService implements IUserService{
  private userRepository:IUserRepository
  constructor(userRepository:IUserRepository){
    this.userRepository = userRepository
  }
  async addUser (userData: IUser): Promise<string> {
    try {
      return await this.userRepository.addUser(userData);
    } catch (error: any) {
      throw new Error(MESSAGES.ERROR_ADDING_USER); 
    }
  }
  async getUser(userId: string | Types.ObjectId): Promise<IUser> {
    try {
      return await this.userRepository.getUser(userId);
    } catch (error: any) {
      throw new Error(MESSAGES.ERROR_FETCHING_USER); 
    }
  }
  async updateUser (userData: IUser): Promise<string> {
    try {
      return await this.userRepository.updateUser(userData);
    } catch (error: any) {
      throw new Error(MESSAGES.ERROR_UPDATING_USER); 
    }
  }
}

