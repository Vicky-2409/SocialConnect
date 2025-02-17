// import { Types } from "mongoose";
// import userCollection, { IUser } from "../models/userCollection";
// import { MESSAGES } from "../utils/constants";

// export interface IUserRepository {
//   addUser(userData: IUser): Promise<string>; // Method to add a new user, returns a string message
//   getUser(userId: string | Types.ObjectId): Promise<IUser>; // Method to get a user by ID, returns the user data
//   updateUser(userData: IUser): Promise<string>; // Method to update user data, returns a string message
// }

// export default class UserRepository implements IUserRepository {
//   async addUser(userData: IUser): Promise<string> {
//     try {
//       if (typeof userData._id === "string") {
//         userData._id = new Types.ObjectId(userData._id);
//       }
//       await userCollection.create(userData);
//       return MESSAGES.USER_ADDED_SUCCESSFULLY;
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }

//   async getUser(userId: string | Types.ObjectId): Promise<IUser> {
//     try {
//       let _id;
//       if (typeof userId === "string") {
//         _id = new Types.ObjectId(userId);
//       } else {
//         _id = userId;
//       }
//       const userData = await userCollection.findOne({ _id });
//       if (!userData) throw new Error(MESSAGES.USER_NOT_FOUND);
//       return userData;
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }

//   async updateUser(userData: IUser): Promise<string> {
//     try {
//       const _id = new Types.ObjectId(userData._id);
//       const user: any = await userCollection.findOne({ _id });
//       if (!user) {
//         throw new Error(MESSAGES.USER_NOT_FOUND);
//       }

//       const updatedUser = {
//         ...user._doc,
//         ...userData,
//       };
//       await userCollection.findOneAndUpdate({ _id }, { $set: updatedUser });

//       return MESSAGES.USER_UPDATED_SUCCESSFULLY;
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }
// }






























import { Types } from "mongoose";
import userCollection, { IUser } from "../models/userCollection";
import { MESSAGES } from "../utils/constants";
import { BaseRepository } from "./baseRepository";

export interface IUserRepository {
  addUser(userData: IUser): Promise<string>;
  getUser(userId: string | Types.ObjectId): Promise<IUser>;
  updateUser(userData: IUser): Promise<string>;
}

export default class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(userCollection);
  }

  async addUser(userData: IUser): Promise<string> {
    // Convert string _id to ObjectId if needed
    if (typeof userData._id === "string") {
      userData._id = new Types.ObjectId(userData._id);
    }
    
    await this.create(userData);
    return MESSAGES.USER_ADDED_SUCCESSFULLY;
  }

  async getUser(userId: string | Types.ObjectId): Promise<IUser> {
    // Convert string userId to ObjectId if needed
    const _id = typeof userId === "string" ? new Types.ObjectId(userId) : userId;
    
    const userData = await this.findOne({ _id });
    if (!userData) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }
    
    return userData;
  }

  async updateUser(userData: IUser): Promise<string> {
    const _id = new Types.ObjectId(userData._id);
    
    // First check if user exists
    const existingUser = await this.findOne({ _id });
    if (!existingUser) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    // Merge existing user data with updated data
    const updatedUser = {
      ...existingUser.toObject(),
      ...userData,
    };

    // Use the base repository's update method
    await this.update(_id, updatedUser);
    return MESSAGES.USER_UPDATED_SUCCESSFULLY;
  }
}