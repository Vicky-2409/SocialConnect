// import { Types } from "mongoose";
// import userCollection, { IUser } from "../models/userCollection";
// import { MESSAGES } from "../utils/constants";

// export interface IUserRepository {
//   addUser(userData: IUser): Promise<string>;
//   getUser(userId: string | Types.ObjectId): Promise<IUser>;
//   updateUser(userData: IUser): Promise<string>;
// }

// export default class UserRepository implements IUserRepository {
//   async addUser(userData: IUser): Promise<string> {
//     try {
//       if (typeof userData._id === "string") {
//         userData._id = new Types.ObjectId(userData._id);
//       }
//       await userCollection.create(userData);
//       return MESSAGES.USER_ADDED_SUCCESS;
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
//       const userData = await userCollection.findOne(_id);
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
//         throw new Error(MESSAGES.USER_NOT_FOUND); // Use constant message
//       }

//       const updatedUser = {
//         ...user._doc,
//         ...userData,
//       };
//       await userCollection.findOneAndUpdate({ _id }, { $set: updatedUser });

//       return MESSAGES.USER_UPDATED_SUCCESS;
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }
// }






















import { Types } from "mongoose";
import { BaseRepository } from "./baseRepository";
import userCollection, { IUser } from "../models/userCollection";
import { MESSAGES } from "../utils/constants";



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
    try {
      if (typeof userData._id === "string") {
        userData._id = new Types.ObjectId(userData._id);
      }
      await this.create(userData);
      return MESSAGES.USER_ADDED_SUCCESS;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getUser(userId: string | Types.ObjectId): Promise<IUser> {
    try {
      const _id = typeof userId === "string" ? new Types.ObjectId(userId) : userId;
      const userData = await this.findById(_id);
      
      if (!userData) {
        throw new Error(MESSAGES.USER_NOT_FOUND);
      }
      
      return userData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateUser(userData: IUser): Promise<string> {
    try {
      const _id = new Types.ObjectId(userData._id);
      const user = await this.findById(_id);
      
      if (!user) {
        throw new Error(MESSAGES.USER_NOT_FOUND);
      }

      const updatedUser = {
        ...user.toObject(),
        ...userData,
      };
      
      await this.update(_id, updatedUser);
      return MESSAGES.USER_UPDATED_SUCCESS;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}