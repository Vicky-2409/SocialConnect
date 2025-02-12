import { Types } from "mongoose";
import userCollection, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import { uploadToS3Bucket } from "../utils/s3Bucket";
import { IMulterFile, IProfileRepository } from "../types/types";
import { MQINotification, publisher } from "../rabbitMq/publisher";
import { MQActions } from "../rabbitMq/config";
import {
  EnvErrorMsg,
  JwtErrorMsg,
  Role,
  UserErrorMsg,
} from "../utils/constants";
import { emitNotification, handleFollow } from "../socket";

export default class ProfileRepository implements IProfileRepository {
  async getUserData(_id: string | Types.ObjectId): Promise<IUser> {
    try {
      const userData = await userCollection.findOne({ _id });

      if (!userData) throw new Error(UserErrorMsg.NO_USER_DATA);
      return userData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async editUserData(
    _id: string | Types.ObjectId,
    userData: IUser
  ): Promise<IUser> {
    try {
      const user: any = await userCollection.findOne({ _id });
      if (!user) {
        throw new Error(UserErrorMsg.NO_USER);
      }

      const updatedUser = {
        ...user._doc,
        ...userData,
        dateOfBirth: new Date(
          userData?.dateOfBirth || user.dateOfBirth || "1970-11-12"
        ),
      };
      const result = await userCollection.findOneAndUpdate(
        { _id },
        { $set: updatedUser },
        { new: true } // new: true returns the updated document
      );

      if (!result) {
        throw new Error(UserErrorMsg.NO_USER);
      }
      return result as IUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async generateJWT(userData: IUser): Promise<string> {
    try {
      const secret: string | undefined = process.env.JWT_SECRET;
      if (!secret) throw new Error(EnvErrorMsg.JWT_NOT_FOUND);
      const data = { userData, role: Role.User };
      return jwt.sign(data, secret, { expiresIn: JwtErrorMsg.JWT_EXPIRATION });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async uploadImage(imageFile: unknown, imageType: string): Promise<string> {
    try {
      const folderName = imageType;
      const result = await uploadToS3Bucket(
        imageFile as IMulterFile,
        folderName
      );

      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getProfileData(username: string): Promise<IUser> {
    try {
      const userData = await userCollection
        .findOne({ username })
        .populate({
          path: "following", // Populate likedBy field
          select: "firstName lastName username profilePicUrl", // Select fields you want from the user model
        })
        .populate({
          path: "followers", // Populate likedBy field
          select: "firstName lastName username profilePicUrl", // Select fields you want from the user model
        });

      if (!userData) throw new Error("No user found");
      return userData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async isFollowing(user1: string, user2: string): Promise<boolean> {
    try {
      const user1Id = new Types.ObjectId(user1);
      const user2Id = new Types.ObjectId(user2);

      const user1Data = await userCollection.findOne({ _id: user1Id });
      if (!user1Data) throw new Error(UserErrorMsg.NO_USER_DATA);

      const user2Data = await userCollection.findOne({ _id: user2Id });
      if (!user2Data) throw new Error(UserErrorMsg.NO_USER_DATA);

      let isFollowing = false;
      let index1, index2;

      if (user1Data.following && user2Data.followers) {
        index1 = user1Data.following.findIndex((id: Types.ObjectId) =>
          id.equals(user2Id)
        );
        index2 = user2Data.followers.findIndex((id: Types.ObjectId) =>
          id.equals(user1Id)
        );
        isFollowing = index1 !== -1 && index2 !== -1;
      }

      return isFollowing;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async toggleFollow(user1: string, user2: string): Promise<boolean> {
    try {
      const user1Id = new Types.ObjectId(user1);
      const user2Id = new Types.ObjectId(user2);

      const user1Data = await userCollection.findOne({ _id: user1Id });
      if (!user1Data) throw new Error(UserErrorMsg.NO_USER_DATA);

      const user2Data = await userCollection.findOne({ _id: user2Id });
      if (!user2Data) throw new Error(UserErrorMsg.NO_USER_DATA);

      let isFollowing = false;
      let index1, index2;

      if (user1Data.following && user2Data.followers) {
        index1 = user1Data.following.findIndex((id: Types.ObjectId) =>
          id.equals(user2Id)
        );
        index2 = user2Data.followers.findIndex((id: Types.ObjectId) =>
          id.equals(user1Id)
        );
        isFollowing = index1 !== -1 && index2 !== -1;
      }

      if (isFollowing) {
        //unfollow operation
        if (index1 != undefined) user1Data.following?.splice(index1, 1);
        if (index2 != undefined) user2Data.followers?.splice(index2, 1);
      } else {
        //follow operation
        user1Data.following?.push(user2Id);
        user2Data.followers?.push(user1Id);

        handleFollow(String(user2Id), user1Data);
      }

      await user1Data.save();
      await user2Data.save();

      return !isFollowing;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async toggleRemove(
    currentUserId: string,
    userToRemove: string
  ): Promise<boolean> {
    try {
      const currentUserid = new Types.ObjectId(currentUserId);
      const userToRemoveId = new Types.ObjectId(userToRemove);

      const currentUser = await userCollection.findOne({ _id: currentUserid });
      if (!currentUser) throw new Error(UserErrorMsg.NO_USER_DATA);

      const userToRemoved = await userCollection.findOne({
        _id: userToRemoveId,
      });
      if (!userToRemoved) throw new Error(UserErrorMsg.NO_USER_DATA);

      let isFollowing = false;
      let index1, index2;

      if (userToRemoved.following && currentUser.followers) {
        index1 = userToRemoved.following.findIndex((id: Types.ObjectId) =>
          id.equals(currentUserid)
        );
        index2 = currentUser.followers.findIndex((id: Types.ObjectId) =>
          id.equals(userToRemoveId)
        );
        isFollowing = index1 !== -1 && index2 !== -1;
      }

      if (isFollowing) {
        //unfollow operation
        if (index1 != undefined) userToRemoved.following?.splice(index1, 1);
        if (index2 != undefined) currentUser.followers?.splice(index2, 1);
      }

      await currentUser.save();
      await userToRemoved.save();

      return !isFollowing;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async searchUsers(keyword: string): Promise<IUser[]> {
    try {
      const regex = new RegExp(keyword, "i");
      const users = await userCollection.find({
        $or: [
          { username: { $regex: regex } },
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
        ],
      });

      return users;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async sendNotificationToMQ(
    userId: string | Types.ObjectId,
    doneByUser: string | Types.ObjectId,
    type: "follow" | "like" | "comment",
    notificationMessage: string,
    entityType: "posts" | "users",
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

  async toggleBlock(user1: string, user2: string): Promise<boolean> {
    try {
      const user1Id = new Types.ObjectId(user1);
      const user2Id = new Types.ObjectId(user2);

      const user1Data = await userCollection.findOne({ _id: user1Id });
      if (!user1Data) throw new Error(UserErrorMsg.NO_USER_DATA);

      const user2Data = await userCollection.findOne({ _id: user2Id });
      if (!user2Data) throw new Error(UserErrorMsg.NO_USER_DATA);

      let isBlocked = false;
      let index1, index2;

      if (user1Data.blockedUsers && user2Data.blockedByUsers) {
        index1 = user1Data.blockedUsers.findIndex((id: Types.ObjectId) =>
          id.equals(user2Id)
        );
        index2 = user2Data.blockedByUsers.findIndex((id: Types.ObjectId) =>
          id.equals(user1Id)
        );
        isBlocked = index1 !== -1 && index2 !== -1;
      }

      if (isBlocked) {
        //unblock operation
        if (index1 != undefined) user1Data.blockedUsers?.splice(index1, 1);
        if (index2 != undefined) user2Data.blockedByUsers?.splice(index2, 1);
      } else {
        //block operation
        user1Data.blockedUsers?.push(user2Id);
        user2Data.blockedByUsers?.push(user1Id);
      }

      await user1Data.save();
      await user2Data.save();

      return !isBlocked;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async isBlocked(user1: string, user2: string): Promise<boolean> {
    try {
      const user1Id = new Types.ObjectId(user1);
      const user2Id = new Types.ObjectId(user2);

      const user1Data = await userCollection.findOne({ _id: user1Id });
      if (!user1Data) throw new Error(UserErrorMsg.NO_USER_DATA);

      const user2Data = await userCollection.findOne({ _id: user2Id });
      if (!user2Data) throw new Error(UserErrorMsg.NO_USER_DATA);

      let isBlocked = false;
      let index1, index2;

      if (user1Data.blockedUsers && user2Data.blockedByUsers) {
        index1 = user1Data.blockedUsers.findIndex((id: Types.ObjectId) =>
          id.equals(user2Id)
        );
        index2 = user2Data.blockedByUsers.findIndex((id: Types.ObjectId) =>
          id.equals(user1Id)
        );
        isBlocked = index1 !== -1 && index2 !== -1;
      }

      return isBlocked;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getBlockedUsers(userId: string): Promise<Types.ObjectId[] | undefined> {
    try {
      const user = await userCollection
        .findOne({ _id: new Types.ObjectId(userId) })
        .populate("blockedUsers");

      if (!user) throw new Error(UserErrorMsg.NO_USER);

      return user.blockedUsers;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getFollowingUsers(
    userId: string
  ): Promise<Types.ObjectId[] | undefined> {
    try {
      const user = await userCollection
        .findOne({ _id: new Types.ObjectId(userId) })
        .populate("following");

      if (!user) throw new Error(UserErrorMsg.NO_USER);

      return user.following;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
