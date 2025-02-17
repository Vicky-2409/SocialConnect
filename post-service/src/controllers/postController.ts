import { NextFunction, Request, Response } from "express";
import { IPostsServices } from "../services/postService";
import { IUserService } from "../services/userService";
import userCollection from "../models/userCollection";
import { MESSAGES } from "../utils/constants";
import { StatusCode } from "../utils/StatusCode";
import logger from "../utils/logger";

export interface IPostController {
  createPost(req: any, res: Response, next: NextFunction): Promise<void>;
  addCaption(req: any, res: Response, next: NextFunction): Promise<void>;
  searchPost(req: any, res: Response, next: NextFunction): Promise<void>;
  getSinglePost(req: any, res: Response, next: NextFunction): Promise<void>;
  editPost(req: Request, res: Response, next: NextFunction): Promise<void>;
  deletePost(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleLike(req: any, res: Response, next: NextFunction): Promise<void>;
  toggleBookmark(req: any, res: Response, next: NextFunction): Promise<void>;
  getPublicFeed(req: Request, res: Response, next: NextFunction): Promise<void>;
  getFeed(req: any, res: Response, next: NextFunction): Promise<void>;
  getBookmarkedPosts(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getProfileFeed(req: any, res: Response, next: NextFunction): Promise<void>;
}

export default class PostController implements IPostController {
  private postsServices: IPostsServices;
  private userServices: IUserService;

  constructor(postsServices: IPostsServices, userServices: IUserService) {
    this.postsServices = postsServices;
    this.userServices = userServices;
  }



  async createPost(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.files || req.files.length === 0) {
        res.status(400).json("No images uploaded");
      }
      const userId = req.user._id;
      const uploadedFiles = req.files;
      const imageUrls = [];

      for (const file of uploadedFiles) {
        try {
          const result = await this.postsServices.uploadImage(file);

          imageUrls.push(result);
        } catch (error) {
          console.error("Error processing image:", error);
          continue;
        }
      }
      if (imageUrls.length === 0) {
        res.status(500).json("Failed to process any images");
      }
      const postData = await this.postsServices.createPost(userId, imageUrls);
      logger.info(`Post created by user ${userId}`);
      res.status(StatusCode.OK).send({ postData });
    } catch (error: any) {
      logger.error(`Error in createPost: ${error.message}`);
      next(error);
    }
  }

  async addCaption(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const { _id, caption } = req.body.data;

      const userId = req.user._id;
      const postData = await this.postsServices.addCaption(
        _id,
        caption,
        userId
      );
      logger.info(`Caption added to post ${_id} by user ${userId}`);
      res.status(StatusCode.OK).send(postData);
    } catch (error: any) {
      logger.error(`Error in addCaption: ${error.message}`);
      next(error);
    }
  }

  async searchPost(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const { keyword } = req.body.params;

      const postData = await this.postsServices.searchPost(keyword);
      res.status(StatusCode.OK).send(postData);
    } catch (error: any) {
      logger.error(`Error in addCaption: ${error.message}`);
      next(error);
    }
  }

  async getSinglePost(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { postId } = req.params;

      const {
        userId,
        imageUrls,
        caption,
        likedBy,
        comments,
        updatedAt,
        createdAt,
        bookmarkedBy,
        isDeleted,
      } = await this.postsServices.getSinglePost(postId);

      const { username, firstName, lastName, profilePicUrl } =
        await this.userServices.getUser(userId);

      const isLiked = await this.postsServices.postIsLiked(
        req.user._id,
        postId
      );
      const isBookmarked = await this.postsServices.postIsBookmarked(
        req.user._id,
        bookmarkedBy
      );

      const postData = {
        _id: postId,
        userId,
        username,
        firstName,
        lastName,
        profilePicUrl,
        caption,
        imageUrls,
        likedBy,
        isLiked,
        comments,
        updatedAt,
        createdAt,
        isBookmarked,
        isDeleted,
      };

      logger.info(`Post ${postId} retrieved successfully`);
      res.status(StatusCode.OK).json(postData);
    } catch (error: any) {
      logger.error(`Error in getSinglePost: ${error.message}`);
      next(error);
    }
  }

  async editPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { postId } = req.params;
      const { caption } = req.body;
      const message = await this.postsServices.editPost(postId, caption);
      logger.info(`Post ${postId} edited successfully`);
      res.status(StatusCode.OK).send(message);
    } catch (error: any) {
      logger.error(`Error in editPost: ${error.message}`);
      next(error);
    }
  }

  async deletePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { postId } = req.params;
      const message = await this.postsServices.deletePost(postId);
      logger.info(`Post ${postId} deleted successfully`);
      res.status(StatusCode.OK).send(message);
    } catch (error: any) {
      logger.error(`Error in deletePost: ${error.message}`);
      next(error);
    }
  }

  async toggleLike(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const { _id } = req.user;
      const { entity, entityId } = req.params;
      const entityCount = await this.postsServices.toggleLike(
        entity,
        entityId,
        _id
      );
      logger.info(`Like toggled on ${entity} ${entityId} by user ${_id}`);
      res.status(StatusCode.OK).send(entityCount);
    } catch (error: any) {
      logger.error(`Error in toggleLike: ${error.message}`);
      next(error);
    }
  }

  async toggleBookmark(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { _id } = req.user;
      const { postId } = req.params;
      logger.info(`User ${_id} is toggling bookmark for post ${postId}`);
      const message = await this.postsServices.toggleBookmark(postId, _id);
      res.status(StatusCode.OK).send(message);
    } catch (error: any) {
      logger.error(`Error in toggleBookmark: ${error.message}`);

      next(error);
    }
  }

  async getPublicFeed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    logger.info("Fetching top posts for public feed");
    try {
      const topPosts = await this.postsServices.getTopPosts();

      let topPostsData: any = topPosts.map(async (postId) => {
        try {
          const {
            userId,
            imageUrls,
            caption,
            likedBy,
            comments,
            updatedAt,
            createdAt,
          } = await this.postsServices.getSinglePost(postId);

          const { username, firstName, lastName, profilePicUrl } =
            await this.userServices.getUser(userId);
          const isLiked = false;
          const isBookmarked = false;

          return {
            _id: postId,
            userId,
            username,
            firstName,
            lastName,
            profilePicUrl,
            caption,
            imageUrls,
            likedBy,
            isLiked,
            comments,
            updatedAt,
            createdAt,
            isBookmarked,
          };
        } catch (error: any) {
          console.log(error);
          logger.error(
            `Error fetching post details for post ${postId}: ${error.message}`
          );
          return null;
        }
      });

      topPostsData = await Promise.all(topPostsData);
      res.status(StatusCode.OK).json({ topPostsData });
    } catch (error: any) {
      logger.error(`Error in getPublicFeed: ${error.message}`);
      next(error);
    }
  }

  async getFeed(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const currUserId = req.user._id;
      logger.info(`Fetching feed for user ${currUserId}`);
      const topPosts = await this.postsServices.getTopPosts();

      let topPostsData: any = topPosts.map(async (postId) => {
        try {
          const {
            userId,
            imageUrls,
            caption,
            likedBy,
            comments,
            updatedAt,
            createdAt,
          } = await this.postsServices.getSinglePost(postId);

          const { username, firstName, lastName, profilePicUrl } =
            await this.userServices.getUser(userId);
          const isLiked = await this.postsServices.postIsLiked(
            req.user._id,
            postId
          );
          const isBookmarked = false;

          return {
            _id: postId,
            userId,
            username,
            firstName,
            lastName,
            profilePicUrl,
            caption,
            imageUrls,
            likedBy,
            isLiked,
            comments,
            updatedAt,
            createdAt,
            isBookmarked,
          };
        } catch (error: any) {
          console.log(error);
          logger.error(
            `Error fetching post details for post ${postId}: ${error.message}`
          );
          return null;
        }
      });

      topPostsData = await Promise.all(topPostsData);
      res.status(StatusCode.OK).json({ topPostsData });
    } catch (error: any) {
      logger.error(`Error in getFeed: ${error.message}`);
      next(error);
    }
  }

  async getBookmarkedPosts(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      logger.info(`Fetching bookmarked posts for user: ${userId}`);

      const bookmarkedPosts = await this.postsServices.getBookmarkedPosts(
        req.user._id
      );
      logger.info(
        `Found ${bookmarkedPosts.length} bookmarked posts for user: ${userId}`
      );

      let postsData: any = bookmarkedPosts.map(async (postId) => {
        const {
          userId,
          imageUrls,
          caption,
          likedBy,
          comments,
          updatedAt,
          createdAt,
        } = await this.postsServices.getSinglePost(postId);

        const { username, firstName, lastName, profilePicUrl } =
          await this.userServices.getUser(userId);
        const isLiked = false;
        const isBookmarked = false;

        return {
          _id: postId,
          userId,
          username,
          firstName,
          lastName,
          profilePicUrl,
          caption,
          imageUrls,
          likedBy,
          isLiked,
          comments,
          updatedAt,
          createdAt,
          isBookmarked,
        };
      });

      postsData = await Promise.all(postsData);
      res.status(StatusCode.OK).json(postsData);
    } catch (error: any) {
      logger.error(`Error fetching post data ${error.message}`);
      next(error);
    }
  }

  async getProfileFeed(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username } = req.params;
      logger.info(`Fetching profile feed for user: ${username}`);
      const user = await userCollection.findOne({ username });
      if (!user) {
        logger.warn(`User with username: ${username} not found`);
        throw new Error("User not found");
      }
      const posts = await this.postsServices.getProfilePosts(
        user._id.toString()
      );
      logger.info(`Found ${posts.length} posts for user: ${username}`);

      let postsData: any = posts.map(async (postId) => {
        try {
          const {
            userId,
            imageUrls,
            caption,
            likedBy,
            comments,
            updatedAt,
            createdAt,
          } = await this.postsServices.getSinglePost(postId);

          const { username, firstName, lastName, profilePicUrl } =
            await this.userServices.getUser(userId);
          const isLiked = await this.postsServices.postIsLiked(
            req.user._id,
            postId
          );
          const isBookmarked = false;

          return {
            _id: postId,
            userId,
            username,
            firstName,
            lastName,
            profilePicUrl,
            caption,
            imageUrls,
            likedBy,
            isLiked,
            comments,
            updatedAt,
            createdAt,
            isBookmarked,
          };
        } catch (error: any) {
          console.log(error);
          logger.error(
            `Error fetching post data for postId: ${postId} - ${error.message}`
          );
          return null;
        }
      });

      postsData = await Promise.all(postsData);
      res.status(StatusCode.OK).json(postsData);
    } catch (error: any) {
      logger.error(`Error in getProfileFeed: ${error.message}`);
      next(error);
    }
  }
}
