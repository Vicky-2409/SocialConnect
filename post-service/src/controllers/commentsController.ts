import { NextFunction, Response } from "express";
import { ICommentsServices } from "../services/commentsServices";
import { IUserService } from "../services/userService";
import { StatusCode } from "../utils/StatusCode";
import logger from "../utils/logger";

export interface ICommentController {
  addComment(req: any, res: Response, next: NextFunction): Promise<void>;
  addReplyComment(req: any, res: Response, next: NextFunction): Promise<void>;
  deleteComment(req: any, res: Response, next: NextFunction): Promise<void>;
  editComment(req: any, res: Response, next: NextFunction): Promise<void>;
}

export default class CommentController implements ICommentController {
  private commentsServices: ICommentsServices;
  private userServices: IUserService;

  constructor(commentsServices: ICommentsServices, userServices: IUserService) {
    (this.commentsServices = commentsServices),
      (this.userServices = userServices);
  }

  async addReplyComment(req: any, res: Response, next: NextFunction) {
    logger.info("Entering addReplyComment method");
    try {
      const { postId, parentCommentId, content } = req.body.data;

      const id = req.user._id;
      logger.debug(
        `addComment - postId: ${postId}, parentCommentId ${parentCommentId}, userId: ${id}, comment: ${content}`
      );
      const { userId, updatedAt, _id } =
        await this.commentsServices.addReplyComment(
          id,
          postId,
          content,
          parentCommentId
        );
      logger.info(`Comment added successfully with ID: ${_id}`);
      const { username, profilePicUrl } = await this.userServices.getUser(
        userId
      );
      logger.debug(
        `Fetched user details - username: ${username}, profilePicUrl: ${profilePicUrl}`
      );
      const commentData = {
        _id,
        userId,
        profilePicUrl,
        username,
        content,
        updatedAt,
      };

      res.status(StatusCode.OK).send(commentData);
    } catch (error: any) {
      logger.error(`Error in addReplyComment: ${error.message}`, { error });
      next(error);
    }
  }
  async addComment(req: any, res: Response, next: NextFunction) {
    logger.info("Entering addComment method");
    try {
      const { postId } = req.params;
      console.log(req.params, "//////////////////////////////////////////////");
      const id = req.user._id;
      const { comment } = req.body;
      logger.debug(
        `addComment - postId: ${postId}, userId: ${id}, comment: ${comment}`
      );
      const { userId, updatedAt, _id } = await this.commentsServices.addComment(
        id,
        postId,
        comment
      );
      logger.info(`Comment added successfully with ID: ${_id}`);
      const { username, profilePicUrl } = await this.userServices.getUser(
        userId
      );
      logger.debug(
        `Fetched user details - username: ${username}, profilePicUrl: ${profilePicUrl}`
      );
      const commentData = {
        _id,
        userId,
        profilePicUrl,
        username,
        comment,
        updatedAt,
      };

      res.status(StatusCode.OK).send(commentData);
    } catch (error: any) {
      logger.error(`Error in addComment: ${error.message}`, { error });
      next(error);
    }
  }

  async deleteComment(req: any, res: Response, next: NextFunction) {
    logger.info("Entering deleteComment method");
    try {
      const { commentId } = req.params;
      logger.debug(`deleteComment - commentId: ${commentId}`);
      const result = await this.commentsServices.deleteComment(commentId);
      logger.info(`Comment deleted successfully with ID: ${commentId}`);
      res.status(StatusCode.OK).send(result);
    } catch (error: any) {
      logger.error(`Error in deleteComment: ${error.message}`, { error });
      next(error);
    }
  }

  async editComment(req: any, res: Response, next: NextFunction) {
    logger.info("Entering editComment method");
    try {
      const { commentId } = req.params;
      const { comment } = req.body;
      logger.debug(
        `editComment - commentId: ${commentId}, updatedComment: ${comment}`
      );
      const commentRes = await this.commentsServices.editComment(
        commentId,
        comment
      );
      logger.info(`Comment edited successfully with ID: ${commentId}`);
      res.status(StatusCode.OK).send(commentRes);
    } catch (error: any) {
      logger.error(`Error in editComment: ${error.message}`, { error });
      next(error);
    }
  }
}
