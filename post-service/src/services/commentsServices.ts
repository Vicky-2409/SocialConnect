import { IComment } from "../models/commentCollection";
import { ICommentRepository } from "../repositories/commentsRepository";
import { IPostRepository } from "../repositories/postRepository";

export interface ICommentsServices {
  addComment(
    currUserId: string,
    postId: string,
    comment: string
  ): Promise<IComment>; // Method to add a comment
  addReplyComment(
    currUserId: string,
    postId: string,
    comment: string,
    parentCommentId: string
  ): Promise<IComment>; // Method to add a comment

  editComment(commentId: string, comment: string): Promise<string>; // Method to edit a comment

  deleteComment(commentId: string): Promise<string>; // Method to delete a comment
}

export default class CommentsServices implements ICommentsServices {
  private commentsRepository: ICommentRepository;
  private postsRepository: IPostRepository;
  constructor(
    commentsRepository: ICommentRepository,
    postsRepository: IPostRepository
  ) {
    (this.commentsRepository = commentsRepository),
      (this.postsRepository = postsRepository);
  }
  async addComment(
    currUserId: string,
    postId: string,
    comment: string
  ): Promise<IComment> {
    try {
      const commentData = await this.commentsRepository.addComment(
        currUserId,
        postId,
        comment
      );

      const postData = await this.postsRepository.getPostData(
        commentData.postId
      );

      try {
        const userId = postData.userId.toString();
        const doneByUser = currUserId;
        const postId = commentData.postId;

        if (userId !== doneByUser) {
          await this.postsRepository.sendNotificationToMQ(
            userId,
            doneByUser,
            "comment",
            `Commented on your post`,
            "posts",
            postId
          );
        }
      } catch (error: any) {
        console.log(error.message);
      }

      return commentData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async addReplyComment(
    currUserId: string,
    postId: string,
    comment: string,
    parentCommentId: string
  ): Promise<IComment> {
    try {
      const commentData = await this.commentsRepository.addReplyComment(
        currUserId,
        postId,
        comment,
        parentCommentId
      );

      const postData = await this.postsRepository.getPostData(
        commentData.postId
      );

      try {
        const userId = postData.userId.toString();
        const doneByUser = currUserId;
        const postId = commentData.postId;

        if (userId !== doneByUser) {
          await this.postsRepository.sendNotificationToMQ(
            userId,
            doneByUser,
            "comment",
            `Commented on your post`,
            "posts",
            postId
          );
        }
      } catch (error: any) {
        console.log(error.message);
      }

      return commentData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async editComment(commentId: string, comment: string): Promise<string> {
    try {
      const commentData = await this.commentsRepository.editComment(
        commentId,
        comment
      );
      const commentRes = commentData.comment;
      return commentRes;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteComment(commentId: string): Promise<string> {
    try {
      return await this.commentsRepository.deleteComment(commentId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
