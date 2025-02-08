import { Types } from "mongoose";
import { IUser } from "../models/User";
import { IProfileRepository, IProfileService } from "../types/types";

export default class ProfileService implements IProfileService {
  private profileRepository: IProfileRepository;
  constructor(profileRepository: IProfileRepository) {
    this.profileRepository = profileRepository;
  }

  async getUserData(_id: string | Types.ObjectId): Promise<IUser> {
    try {
      return await this.profileRepository.getUserData(_id);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async editUserData(
    _id: string | Types.ObjectId,
    userData: IUser
  ): Promise<IUser> {
    try {
      return this.profileRepository.editUserData(_id, userData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async generateJWT(userData: IUser): Promise<string> {
    try {
      return await this.profileRepository.generateJWT(userData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async uploadImage(imageFile: unknown, imageType: string): Promise<string> {
    try {

      
      return await this.profileRepository.uploadImage(imageFile, imageType);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getProfileData(username: string): Promise<IUser> {
    try {
      return this.profileRepository.getProfileData(username);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async toggleFollow(
    currentUserId: string,
    userToFollow: string
  ): Promise<boolean> {
    try {
      const isFollowing = await this.profileRepository.toggleFollow(
        currentUserId,
        userToFollow
      );

      if (isFollowing) {
        try {

          await this.profileRepository.sendNotificationToMQ(
            userToFollow,
            currentUserId,
            "follow",
            "Started following you",
            "users",
            currentUserId
          );
          

        } catch (error: any) {
          console.log(error.message);
        }
      }

      return isFollowing;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async toggleRemove(
    currentUserId: string,
    userToRemove: string
  ): Promise<boolean> {
    try {
      const isFollowing = await this.profileRepository.toggleRemove(
        currentUserId,
        userToRemove
      );

      return isFollowing;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async isFollowing(
    currentUserId: string,
    userToFollow: string
  ): Promise<boolean> {
    try {
      return await this.profileRepository.isFollowing(
        currentUserId,
        userToFollow
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async searchUsers(keyword: string): Promise<IUser[]> {
    try {
      return await this.profileRepository.searchUsers(keyword);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async toggleBlock(currUser: string, userId: string): Promise<boolean> {
    try {
      const isBlocked = await this.profileRepository.toggleBlock(
        currUser,
        userId
      );

      if (isBlocked) {
        const isFollowing = await this.profileRepository.isFollowing(
          currUser,
          userId
        );
        if (isFollowing)
          await this.profileRepository.toggleFollow(currUser, userId);
      }

      return isBlocked;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async isBlocked(currentUserId: string, otherUser: string): Promise<boolean> {
    try {
      return await this.profileRepository.isBlocked(currentUserId, otherUser);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getBlockedUsers(
    pageNo: number,
    rowsPerPage: number,
    userId: string
  ): Promise<
    [
      { sNo: number; _id: string; username: string; profilePicUrl: string }[],
      number
    ]
  > {
    try {
      const skip = rowsPerPage * (pageNo - 1);
      const limit = rowsPerPage;

      let blockedUsers = await this.profileRepository.getBlockedUsers(userId);
      if (!blockedUsers) throw Error("Blocked users not found");

      const documentCount = blockedUsers.length;
      blockedUsers = blockedUsers.slice(skip, skip + limit);

      const responseFormat = blockedUsers.map((user: any, i) => {
        const { _id, username, profilePicUrl } = user;

        const sNo = skip + (i + 1);

        return { sNo, _id, username, profilePicUrl };
      });

      return [responseFormat, documentCount];
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getFollowingUsers(currentUserId: string): Promise<any> {
    try {
      const following = await this.profileRepository.getFollowingUsers(
        currentUserId
      );
      if (following?.length == 0) return [];

      const responseFormat = following?.map((user) => {
        return user._id.toString();
      });

      return responseFormat;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
