import { Types } from "mongoose";
import postsCollection, { IPost, IWeNetAds } from "../models/postCollection";
import { IMulterFile } from "../utils/types";
import { uploadToS3Bucket } from "../utils/s3bucket";
import userCollection from "../models/userCollection";
import {
  MQINotification,
  MQIPost,
  MQIPostForAds,
  publisher,
} from "../rabbitMq/publisher";
import { MQActions } from "../rabbitMq/config";
import { MESSAGES } from "../utils/constants";

export interface IPostRepository {
  uploadImage(imageFile: unknown): Promise<string>;

  createPost(userId: string, imageUrls: string[]): Promise<IPost>;

  searchPost(keyword: string): Promise<IPost[]>;
  
  addCaption(postId: string, caption: string): Promise<IPost>;

  getPostData(postId: string | Types.ObjectId): Promise<IPost>;

  getSinglePost(postId: string): Promise<IPost>;

  editPost(postId: string, caption: string): Promise<string>;

  deletePost(postId: string): Promise<string>;

  toggleLike(
    entity: string,
    entityId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ): Promise<IPost>;

  toggleBookmark(
    postId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ): Promise<string>;

  postIsLiked(userId: string, postId: string): Promise<boolean>;
  postIsBookmarked(userId: string, bookmarkedBy: Types.ObjectId[]): Promise<boolean>;

  getTopPosts(): Promise<string[]>;

  getBookmarkedPosts(userId: string): Promise<string[]>;

  sendPostDataToMQ(
    postId: string | Types.ObjectId,
    userId: string,
    caption: string,
    imageUrls: string[],
    isDeleted: boolean,
    action: string
  ): Promise<void>;

  sendNotificationToMQ(
    userId: string | Types.ObjectId,
    doneByUser: string | Types.ObjectId,
    type: "follow" | "like" | "comment",
    notificationMessage: string,
    entityType: "posts" | "users",
    entityId: string | Types.ObjectId
  ): Promise<void>;

  getProfilePosts(userId: string): Promise<string[]>;

  sendPostDataToAdsMQ(
    postId: string | Types.ObjectId,
    userId: string,
    caption: string,
    imageUrls: string[],
    isDeleted: boolean,
    WeNetAds: IWeNetAds,
    action: string
  ): Promise<void>;

  createWeNetAd(postId: string, WeNetAds: IWeNetAds): Promise<IPost>;
}

export default class PostRepository implements IPostRepository {
  async uploadImage(imageFile: unknown): Promise<string> {
    try {
      return await uploadToS3Bucket(imageFile as IMulterFile);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createPost(userId: string, imageUrls: string[]): Promise<IPost> {
    try {
      const postData = { userId, imageUrls };
      return await postsCollection.create(postData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }



  async searchPost(keyword: string): Promise<IPost[]> {
    try {
      const regex = new RegExp(keyword, "i");
  
      const postData = await postsCollection
        .find({
          $or: [
            { caption: { $regex: regex } }, // Direct field search
          ],
        })
        .populate({
          path: "userId",
          select: "username firstName lastName profilePicUrl",
        })
        .exec();
      return postData
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  
  

  async addCaption(postId: string, caption: string): Promise<IPost> {
    try {
      const _id = new Types.ObjectId(postId);
      const post: any = await postsCollection.findOne({ _id });
      if (!post) {
        throw new Error(MESSAGES.POST_NOT_FOUND);
      }

      const updatedPost = { ...post._doc, caption, isDeleted: false };
      const result = await postsCollection.findOneAndUpdate(
        { _id },
        { $set: updatedPost },
        { new: true } // new: true returns the updated document
      );

      if (!result) {
        throw new Error(MESSAGES.POST_NOT_FOUND);
      }

      await userCollection.updateOne(
        { _id: result.userId },
        { $addToSet: { posts: result._id } }
      );

      return result as IPost;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // },

  async getPostData(postId: string | Types.ObjectId) {
    try {
      const post = await postsCollection.findOne({
        _id: new Types.ObjectId(postId),
      });
      if (!post) throw new Error(MESSAGES.POST_NOT_FOUND);
      return post;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // async getSinglePost(postId: string): Promise<IPost> {
  //   try {
  //     const _id = new Types.ObjectId(postId);
  //     const postData = await postsCollection
  //       .findOne({ _id })
  //       .populate({
  //         path: "comments",
  //         populate: {
  //           path: "userId",
  //           select: "username profilePicUrl", // Adjust as necessary
  //         },
  //       })
  //       .populate({
  //         path: "likedBy", // Populate likedBy field
  //         select: "username profilePicUrl", // Select fields you want from the user model
  //       })
  //       .exec();


        
  //     if (!postData) throw new Error(MESSAGES.POST_NOT_FOUND);
  //     if (postData.isDeleted) throw new Error(MESSAGES.POST_ALREADY_DELETED);
  //     return postData;
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }





  async getSinglePost(postId: string): Promise<IPost> {
    try {
      const _id = new Types.ObjectId(postId);
      const postData = await postsCollection
        .findOne({ _id })
        .populate({
          path: "comments",
          populate: [
            {
              path: "userId", // Populate userId field in comments
              select: "username profilePicUrl", // Adjust as necessary
            },
            {
              path: "replies", // Populate replies field in comments
              populate: {
                path: "userId", // Populate userId for each reply
                select: "username profilePicUrl", // Adjust as necessary
              }
            }
          ]
        })
        .populate({
          path: "likedBy", // Populate likedBy field
          select: "username profilePicUrl", // Select fields you want from the user model
        })
        .exec();
  
      if (!postData) throw new Error(MESSAGES.POST_NOT_FOUND);
      // if (postData.isDeleted) throw new Error(MESSAGES.POST_ALREADY_DELETED);
      return postData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  


  async editPost(postId: string, caption: string): Promise<string> {
    try {
      const _id = new Types.ObjectId(postId);
      const post: any = await postsCollection.findOne({ _id });
      if (!post) throw new Error(MESSAGES.POST_NOT_FOUND);
      if (post.isDeleted) throw new Error(MESSAGES.POST_ALREADY_DELETED);
      const updatedPost = { ...post._doc, caption, isDeleted: false };
      await postsCollection.findOneAndUpdate({ _id }, { $set: updatedPost });

      return MESSAGES.POST_EDITED_SUCCESSFULLY;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deletePost(postId: string): Promise<string> {
    try {
      const _id = new Types.ObjectId(postId);
      const post: any = await postsCollection.findOne({ _id });
      if (!post) throw new Error(MESSAGES.POST_NOT_FOUND);
      if (post.isDeleted) throw new Error(MESSAGES.POST_ALREADY_DELETED);

      const updatedPost = { ...post._doc, isDeleted: true };
      await postsCollection.findOneAndUpdate({ _id }, { $set: updatedPost });

      return MESSAGES.POST_DELETED_SUCCESSFULLY;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async toggleLike(
    entity: string,
    entityId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ): Promise<IPost> {
    try {
      // Convert IDs to ObjectId
      userId = new Types.ObjectId(userId);
      entityId = new Types.ObjectId(entityId);

      // Find the user
      const user = await userCollection.findOne({ _id: userId });
      if (!user) throw new Error(MESSAGES.USER_NOT_FOUND);

      if (entity === "post") {
        // Find the post
        const post = await postsCollection.findOne({ _id: entityId });
        if (!post) throw new Error(MESSAGES.POST_NOT_FOUND);

        // Check if the user has already liked the post
        const postIndex = user.postsLiked.findIndex((postId: Types.ObjectId) =>
          postId.equals(entityId)
        );

        if (postIndex !== -1) {
          // Unlike Post
          user.postsLiked.splice(postIndex, 1);
          const likedByIndex = post.likedBy.findIndex(
            (userIdItem: Types.ObjectId) => userIdItem.equals(userId)
          );
          if (likedByIndex !== -1) {
            post.likedBy.splice(likedByIndex, 1);
          }
        } else {
          // Like Post
          user.postsLiked.push(entityId);
          post.likedBy.push(userId);
        }

        // Save changes to user and post
        await user.save();
        await post.save();

        // Populate the likedBy array with user details
        const updatedPost = await postsCollection
          .findOne({ _id: entityId })
          .populate({
            path: "likedBy", // Field to populate
            select: "username profilePicUrl", // Fields to include
          });

        if (!updatedPost) throw new Error(MESSAGES.POST_NOT_FOUND_AFTER_UPDATE);

        return updatedPost; // Return the populated post
      } else {
        throw new Error(MESSAGES.INVALID_ENTITY_TYPE);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async toggleBookmark(
    postId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ): Promise<string> {
    try {
      userId = new Types.ObjectId(userId);
      const user = await userCollection.findOne({ _id: userId });
      if (!user) throw new Error(MESSAGES.USER_NOT_FOUND);

      postId = new Types.ObjectId(postId);
      const postIndex = user.postsBookmarked.findIndex((id: Types.ObjectId) =>
        id.equals(postId)
      );

      let message;
      if (postIndex !== -1) {
        //remove bookmark
        user.postsBookmarked.splice(postIndex, 1);
        await postsCollection.updateOne(
          { _id: postId },
          { $pull: { bookmarkedBy: userId } }
        );
        message = MESSAGES.POST_REMOVED_FROM_BOOKMARK;
      } else {
        //add bookmark
        user.postsBookmarked.push(postId);
        await postsCollection.updateOne(
          { _id: postId },
          { $addToSet: { bookmarkedBy: userId } }
        );
        message = MESSAGES.POST_ADDED_TO_BOOKMARK;
      }
      await user.save();

      return message;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async postIsLiked(userId: string, postId: string): Promise<boolean> {
    try {
      const user = await userCollection
        .findById(userId)
        .select("postsLiked")
        .exec();
      if (!user) {
        throw new Error(MESSAGES.USER_NOT_FOUND);
      }

      const isLiked = user.postsLiked.includes(
        postId as unknown as Types.ObjectId
      );
      return isLiked;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  
  async postIsBookmarked(userId: string, bookmarkedBy: Types.ObjectId[]): Promise<boolean> {
    try {
      const isBookmarked = bookmarkedBy.includes(
        userId as unknown as Types.ObjectId
      );
      return isBookmarked;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getTopPosts(): Promise<string[]> {
    try {
      const posts = await postsCollection.aggregate([
        {
          $match: { isDeleted: false },
        },
        {
          $addFields: {
            likesCount: { $size: "$likedBy" },
          },
        },
        {
          $sort: { likesCount: -1 },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: 35,
        },
        {
          $project: {
            _id: 1,
          },
        },
      ]);

      return posts.map((post) => post._id.toString());
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getBookmarkedPosts(userId: string): Promise<string[]> {
    try {
      const user = await userCollection
        .findById(userId)
        .select("postsBookmarked")
        .exec();

      if (!user) {
        throw new Error(MESSAGES.USER_NOT_FOUND);
      }

      // Return the array of bookmarked post IDs
      return user.postsBookmarked.map((postId) => postId.toString());
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async sendPostDataToMQ(
    postId: string | Types.ObjectId,
    userId: string,
    caption: string,
    imageUrls: string[],
    isDeleted: boolean,
    action: string
  ) {
    try {
      const postData: MQIPost = {
        _id: postId,
        userId,
        caption,
        imageUrl :imageUrls[0],
        isDeleted,
      };

      await publisher.publishPostMessageToNotification(postData, action);
    } catch (error: any) {
      console.error("Error sending user data to MQ:", error.message);
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

  async getProfilePosts(userId: string): Promise<string[]> {
    try {
      const posts = await postsCollection.aggregate([
        {
          $match: { userId: new Types.ObjectId(userId), isDeleted: false },
        },
        {
          $addFields: {
            likesCount: { $size: "$likedBy" },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: 35,
        },
        {
          $project: {
            _id: 1,
          },
        },
      ]);

      return posts.map((post) => post._id.toString());
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async sendPostDataToAdsMQ(
    postId: string | Types.ObjectId,
    userId: string,
    caption: string,
    imageUrls: string[],
    isDeleted: boolean,
    WeNetAds: IWeNetAds,
    action: string
  ) {
    try {
      const postData: MQIPostForAds = {
        _id: postId,
        userId,
        caption,
        imageUrls,
        isDeleted,
        WeNetAds,
      };

      await publisher.publishPostForAdsMessage(postData, action);
    } catch (error: any) {
      console.error("Error sending user data to MQ:", error.message);
      throw new Error(error.message);
    }
  }

  async createWeNetAd(postId: string, WeNetAds: IWeNetAds): Promise<IPost> {
    try {
      const post = await postsCollection.findOne({
        _id: new Types.ObjectId(postId),
      });
      if (!post) throw new Error(MESSAGES.POST_NOT_FOUND);

      post.WeNetAds = WeNetAds;
      post.save();
      return post;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
