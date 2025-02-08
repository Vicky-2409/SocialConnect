import { ObjectId } from "mongoose";
import { IPost, IWeNetAds } from "../models/postCollection";
import { MQActions } from "../rabbitMq/config";
import {IPostRepository} from "../repositories/postRepository";
import { Types } from "mongoose";
import { MESSAGES } from "../utils/constants";




export interface IPostsServices {
  uploadImage(imageFile: unknown): Promise<string>; // Upload an image

  createPost(userId: string, imageUrls:string[]): Promise<IPost>; // Create a post

  addCaption(postId: string, caption: string, userId: string): Promise<IPost>; // Add caption to a post
  
  searchPost(keyword: string): Promise<IPost[]>; // Add caption to a post

  getSinglePost(postId: string): Promise<IPost>; // Get a single post by ID

  editPost(postId: string, caption: string): Promise<string>; // Edit a post's caption

  deletePost(postId: string): Promise<string>; // Delete a post

  toggleLike(entity: string, entityId: string, currUserId: string): Promise<Types.ObjectId[]>; // Toggle like on a post

  toggleBookmark(postId: string, userId: string): Promise<string>; // Toggle bookmark on a post

  postIsLiked(userId: string, postId: string): Promise<boolean>; // Check if a post is liked

  postIsBookmarked(userId: string, bookmarkedBy: Types.ObjectId[]): Promise<boolean>; // Check if a post is liked
  
  getTopPosts(): Promise<string[]>; // Get top posts

  getBookmarkedPosts(userId: string): Promise<string[]>; // Get bookmarked posts for a user

  getProfilePosts(userId: string): Promise<string[]>; // Get posts from a user's profile

  createWeNetAd(postId: string, WeNetAds: IWeNetAds): Promise<string>; // Create WeNet ad for a post
}





export default class PostsServices implements IPostsServices{

  private postsRepository:IPostRepository
  constructor(postsRepository:IPostRepository){
    this.postsRepository = postsRepository
  }
  
  async uploadImage (imageFile: unknown): Promise<string> {
    try {
      return await this.postsRepository.uploadImage(imageFile);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  
  async createPost (
    userId: string,
    imageUrls: string[]
  ): Promise<IPost> {
    try {
      const postData = await this.postsRepository.createPost(userId, imageUrls);
      if (!postData) throw new Error(MESSAGES.POST_NOT_FOUND);

      return postData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async searchPost (
    keyword: string
  ): Promise<IPost[]> {
    try {
      const postData = await this.postsRepository.searchPost(keyword);
      if (!postData) throw new Error(MESSAGES.POST_NOT_FOUND);

      return postData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }



  async addCaption (
    postId: string,
    caption: string,
    userId: string
  ): Promise<IPost> {
    try {
      const postData = await this.postsRepository.addCaption(postId, caption);
      if (!postData) throw new Error(MESSAGES.POST_NOT_FOUND);

      //To notification service
      try {
        const { _id, caption, imageUrls, isDeleted } = postData as IPost;
        await this.postsRepository.sendPostDataToMQ(
          _id,
          userId,
          caption,
          imageUrls,
          isDeleted,
          MQActions.addPost
        );
      } catch (error: any) {
        console.log(error.message);
      }

      //To ads service
      try {
        const { _id, caption, imageUrls, isDeleted, WeNetAds } =
          postData as IPost;
        await this.postsRepository.sendPostDataToAdsMQ(
          _id,
          userId,
          caption,
          imageUrls,
          isDeleted,
          WeNetAds,
          MQActions.addPost
        );
      } catch (error: any) {
        console.log(error.message);
      }

      return postData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }


  async getSinglePost (postId: string): Promise<IPost> {
    try {
      return await this.postsRepository.getSinglePost(postId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }



  async editPost(postId: string, caption: string): Promise<string> {
    try {
      return await this.postsRepository.editPost(postId, caption);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }


  async deletePost(postId: string): Promise<string> {
    try {
      return await this.postsRepository.deletePost(postId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }



  async toggleLike(
    entity: string,
    entityId: string,
    currUserId: string
  ): Promise<Types.ObjectId[]> {
    try {
      const post = await this.postsRepository.toggleLike(
        entity,
        entityId,
        currUserId
      );

      try {
        const userId = post.userId.toString();
        const doneByUser = currUserId;
        const postId = post._id.toString();

        const postIsLiked = await this.postsRepository.postIsLiked(
          doneByUser,
          postId
        );

        if (userId !== doneByUser && postIsLiked == true) {
            await this.postsRepository.sendNotificationToMQ(
              userId,
              doneByUser,
              "like",
              `Liked your ${entity}`,
              "posts",
              postId
            );
        }
      } catch (error: any) {
        console.log(error.message);
      }

      

      return post?.likedBy || [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  }


  async toggleBookmark (
    postId: string,
    userId: string
  ): Promise<string> {
    try {
      return await this.postsRepository.toggleBookmark(postId, userId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }


  async postIsLiked(
    userId: string,
    postId: string
  ): Promise<boolean> {
    try {
      return await this.postsRepository.postIsLiked(userId, postId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async postIsBookmarked(
    userId: string, bookmarkedBy: Types.ObjectId[]
  ): Promise<boolean> {
    try {
      return await this.postsRepository.postIsBookmarked(userId, bookmarkedBy);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }


  async getTopPosts(): Promise<string[]> {
    try {
      return await this.postsRepository.getTopPosts();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }



  async getBookmarkedPosts (userId: string): Promise<string[]> {
    try {
      return await this.postsRepository.getBookmarkedPosts(userId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }


  async getProfilePosts(userId: string): Promise<string[]> {
    try {
      return await this.postsRepository.getProfilePosts(userId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }


  async createWeNetAd(
    postId: string,
    WeNetAds: IWeNetAds
  ): Promise<string> {
    try {
      const postData = await this.postsRepository.createWeNetAd(postId, WeNetAds);
      if (!postData) throw new Error(MESSAGES.POST_NOT_FOUND);

      return MESSAGES.AD_DATA_ADDED_TO_POST;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }


}


