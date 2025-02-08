import { NextFunction, Request, Response } from "express";
import { MQActions } from "../rabbitMq/config";
import {
  UserErrorMsg,
  ResponseMsg,
  GeneralErrorMsg,
  ImageType,
} from "../utils/constants";
import {
  IProfileController,
  IProfileService,
  IUserService,
} from "../types/types";
import logger from "../utils/logger";


export default class ProfileController implements IProfileController {
  private userService: IUserService;
  private profileService: IProfileService;
  constructor(userService: IUserService, profileService: IProfileService) {
    this.userService = userService;
    this.profileService = profileService;
    logger.info('ProfileController initialized');

  }

  async getUser(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const { _id } = req?.user;
      logger.debug('Fetching user data', { userId: _id });

      if (!_id) throw new Error(UserErrorMsg.NO_USER_ID);
      logger.info('User data retrieved successfully', { userId: _id });

      const userData = await this.profileService.getUserData(_id);
      res.status(200).json(userData);
    } catch (error:any) {
      logger.error('Failed to get user data', { error: error?.message, userId: req?.user?._id });

      next(error);
    }
  }
  async getUserData(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const _id = req?.params?.id;
      logger.debug('Fetching user data', { userId: _id });

      if (!_id) throw new Error(UserErrorMsg.NO_USER_ID);
      logger.info('User data retrieved successfully', { userId: _id });

      const userData = await this.profileService.getUserData(_id);
      res.status(200).json(userData);
    } catch (error:any) {
      logger.error('Failed to get user data', { error: error?.message, userId: req?.user?._id });

      next(error);
    }
  }
  async editUser(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req?.user;
      logger.debug('Editing user data', { userId: user?._id });

      if (!user) {
        logger.warn('Edit user request missing user data');
        throw new Error(UserErrorMsg.NO_USER);
      }
      const userData: any = await this.profileService.editUserData(
        req.user._id,
        req.body
      );
      if (!userData) {
        logger.warn('No user data returned after edit', { userId: user._id });
        throw new Error(UserErrorMsg.NO_USER_DATA);
      }
      try {
        logger.debug('Sending user data to message queues', { userId: userData._id });

        await this.userService.sendUserDataToMQ(
          userData._id,
          MQActions.editUser
        );
        await this.userService.sendUserDataToAdsMQ(
          userData._id,
          MQActions.editUser
        )

        logger.info('Successfully sent user data to message queues', { userId: userData._id });

      } catch (error: any) {
        logger.warn('Failed to send user data to message queues', { 
          userId: userData._id, 
          error: error.message 
        });
        console.log(error.message);
      }

      const token = await this.profileService.generateJWT(userData);
      res.cookie("token", token);
      logger.info('User data edited successfully', { userId: userData._id });
      res.status(200).send(ResponseMsg.USER_DATA_EDITED);
    } catch (error:any) {
      logger.error('Failed to edit user data', { 
        error: error?.message, 
        userId: req?.user?._id 
      });
      next(error);
    }
  }

  async updatePic(req: any, res: Response, next: NextFunction): Promise<void> {


    logger.debug('Processing image update request', {
      path: req.path,
      imageType: req.params.imageType,
      userId: req?.user?._id
    });
    try {

      const imageFile = req.file;
      if (!imageFile) {
        logger.warn('No image file provided for update');
        throw new Error(GeneralErrorMsg.NO_IMAGE_FILE);
      }
      const { imageType } = req.params;
   
      
      if (!imageType) throw new Error(GeneralErrorMsg.NO_IMAGE_TYPE);

      req.body[`${imageType}Url`] = await this.profileService.uploadImage(
        imageFile,
        imageType
      );
      logger.info('WeNet tick request picture uploaded', { userId: req?.user?._id });
      next();
    } catch (error) {
      next(error);
    }
  }

  async getProfileData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username } = req.params;
      logger.debug('Fetching profile data', { username });

      if (!username) {
        logger.warn('Profile data request missing username');
        throw new Error(UserErrorMsg.NO_USERNAME);
      }
      const userData = await this.profileService.getProfileData(username);
      logger.info('Profile data retrieved successfully', { username });

      res.status(200).json(userData);
    } catch (error:any) {
      logger.error('Failed to get profile data', { 
        error: error?.message, 
        username: req.params.username 
      });
      next(error);
    }
  }

  async toggleFollow(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userToFollow } = req.params;
      const currentUserId = req.user._id;
      logger.debug('Processing follow toggle', { currentUserId, userToFollow });

      const isFollowing: boolean = await this.profileService.toggleFollow(
        currentUserId,
        userToFollow
      );

      logger.info('Follow status toggled', { 
        currentUserId, 
        userToFollow, 
        isFollowing 
      });

      res.status(200).send(isFollowing);
    } catch (error:any) {
      logger.error('Failed to toggle follow status', {
        error: error?.message,
        currentUserId: req.user._id,
        userToFollow: req.params.userToFollow
      });
      next(error);
    }
  }

  async toggleRemove(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userToRemove } = req.params;

      const currentUserId = req.user._id;
      logger.debug('Processing remove toggle', { currentUserId, userToRemove });

      const isFollowing: boolean = await this.profileService.toggleRemove(
        currentUserId,
        userToRemove
      );

      logger.info('Remove status toggled', {
        currentUserId,
        userToRemove,
        isFollowing
      });
      res.status(200).send(isFollowing);
    } catch (error:any) {
      logger.error('Failed to toggle remove status', {
        error: error?.message,
        currentUserId: req.user._id,
        userToRemove: req.params.userToRemove
      });
      next(error);
    }
  }

  async isFollowing(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const currentUserId = req.user._id;
      logger.debug('Checking following status', { currentUserId, targetUserId: userId });

      const isFollowing: boolean = await this.profileService.isFollowing(
        currentUserId,
        userId
      );

      logger.info('Following status checked', {
        currentUserId,
        targetUserId: userId,
        isFollowing
      });

      res.status(200).send(String(isFollowing));
    } catch (error:any) {
      logger.error('Failed to check following status', {
        error: error?.message,
        currentUserId: req.user._id,
        targetUserId: req.params.userId
      });
      next(error);
    }
  }

  async searchUsers(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { keyword } = req.query;
      logger.debug('Searching users', { keyword });
      const usersData = await this.profileService.searchUsers(keyword);
      logger.info('Users search completed', {
        keyword,
        resultsCount: usersData?.length
      });
  
      res.status(200).send(usersData);
    } catch (error:any) {
      logger.error('Failed to search users', {
        error: error?.message,
        keyword: req.query.keyword
      });
      next(error);
    }
  }

  async toggleBlockUser(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const currUserId = req.user._id;
      logger.debug('Processing block toggle', { currUserId, targetUserId: userId });


      const isBlocked = await this.profileService.toggleBlock(
        currUserId,
        userId
      );

      logger.info('Block status toggled', {
        currUserId,
        targetUserId: userId,
        isBlocked
      });

      res.status(200).send(isBlocked);
    } catch (error:any) {
      logger.error('Failed to toggle block status', {
        error: error?.message,
        currUserId: req.user._id,
        targetUserId: req.params.userId
      });
      next(error);
    }
  }

  async isBlocked(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const currentUserId = req.user._id;
      logger.debug('Checking block status', { currentUserId, targetUserId: userId });

      const isBlocked: boolean = await this.profileService.isBlocked(
        currentUserId,
        userId
      );

      logger.info('Block status checked', {
        currentUserId,
        targetUserId: userId,
        isBlocked
      });
      res.status(200).send(isBlocked);
    } catch (error:any) {
      logger.error('Failed to check block status', {
        error: error?.message,
        currentUserId: req.user._id,
        targetUserId: req.params.userId
      });
      next(error);
    }
  }

  async getBlockedUsers(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      const { pageNo, rowsPerPage } = req.query;
      logger.debug('Fetching blocked users', { userId, pageNo, rowsPerPage });
      const [responseFormat, documentCount] =
        await this.profileService.getBlockedUsers(pageNo, rowsPerPage, userId);
        logger.info('Blocked users retrieved', {
          userId,
          count: documentCount,
          page: pageNo
        });
      res.status(200).send([responseFormat, documentCount]);
    } catch (error:any) {
      logger.error('Failed to get blocked users', {
        error: error?.message,
        userId: req.user._id
      });
      next(error);
    }
  }

  async getFollowingUsers(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      logger.debug('Fetching following users', { userId });
      const data = await this.profileService.getFollowingUsers(userId);
      logger.info('Following users retrieved', {
        userId,
        count: data?.length
      });
      res.status(200).send(data);
    } catch (error:any) {
      logger.error('Failed to get following users', {
        error: error?.message,
        userId: req.user._id
      });
      next(error);
    }
  }

  async uploadWeNetTickRequestPic(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const imageFile = req.file;
      logger.debug('Processing WeNet tick request picture upload', {
        userId: req?.user?._id
      });
      if (!imageFile) {
        logger.warn('No image file provided for WeNet tick request');
        throw new Error(GeneralErrorMsg.NO_IMAGE_FILE);
      }
      req.body.imageUrl = await this.profileService.uploadImage(
        imageFile,
        ImageType.WENET_TICK
      )
      logger.info('WeNet tick request picture uploaded successfully', {
        userId: req?.user?._id
      });
      next();
    } catch (error:any) {
      logger.error('Failed to upload WeNet tick request picture', {
        error: error?.message,
        userId: req?.user?._id
      });
      next(error);
    }
  }
}
