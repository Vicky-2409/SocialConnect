// import { Types } from "mongoose";
// import commentCollection, { IComment } from "../models/commentCollection";
// import postsCollection from "../models/postCollection";
// import userCollection from "../models/userCollection";
// import { MESSAGES } from "../utils/constants";

// export interface ICommentRepository {
//   addComment(
//     userId: string | Types.ObjectId,
//     postId: string | Types.ObjectId,
//     comment: string
//   ): Promise<IComment>;
//   addReplyComment(
//     userId: string | Types.ObjectId,
//     postId: string | Types.ObjectId,
//     comment: string,
//     parentCommentId: string | Types.ObjectId
//   ): Promise<IComment>;

//   editComment(commentId: string, comment: string): Promise<IComment>;

//   deleteComment(commentId: string): Promise<string>;
// }

// export default class CommentRepository implements ICommentRepository {
//   async addComment(
//     userId: string | Types.ObjectId,
//     postId: string | Types.ObjectId,
//     comment: string
//   ): Promise<IComment> {
//     try {
//       userId = new Types.ObjectId(userId);
//       postId = new Types.ObjectId(postId);

//       const commentData = await commentCollection.create({
//         userId,
//         postId,
//         comment,
//       });

//       await userCollection.updateOne(
//         { _id: userId },
//         { $addToSet: { comments: commentData._id } }
//       );

//       await postsCollection.updateOne(
//         { _id: postId },
//         { $addToSet: { comments: commentData._id } }
//       );

//       return commentData;
//     } catch (error: any) {
//       throw new Error(MESSAGES.ERROR_ADDING_COMMENT);
//     }
//   }
//   async addReplyComment(
//     userId: string | Types.ObjectId,
//     postId: string | Types.ObjectId,
//     comment: string,
//     parentCommentId: string | Types.ObjectId
//   ): Promise<IComment> {
//     try {
//       userId = new Types.ObjectId(userId);
//       postId = new Types.ObjectId(postId);

//       const commentData = await commentCollection.create({
//         userId,
//         postId,
//         comment,
//         parentCommentId,
//       });

//       return commentData;
//     } catch (error: any) {
//       throw new Error(MESSAGES.ERROR_ADDING_COMMENT);
//     }
//   }

//   async editComment(commentId: string, comment: string): Promise<IComment> {
//     try {
//       const updatedComment = await commentCollection.findOneAndUpdate(
//         { _id: new Types.ObjectId(commentId) },
//         { $set: { comment } },
//         { new: true, returnDocument: "after" }
//       );

//       if (!updatedComment) throw new Error(MESSAGES.COMMENT_NOT_FOUND);

//       return updatedComment;
//     } catch (error: any) {
//       console.error("Error editing comment:", error);
//       throw new Error(MESSAGES.ERROR_EDITING_COMMENT);
//     }
//   }

//   async deleteComment(commentId: string): Promise<string> {
//     try {
//       await commentCollection.updateOne(
//         { _id: new Types.ObjectId(commentId) },
//         { $set: { isDeleted: true } }
//       );

//       await commentCollection.updateMany(
//         { replies: new Types.ObjectId(commentId) },
//         { $pull: { replies: new Types.ObjectId(commentId) } }
//       );

//       await postsCollection.updateMany(
//         { comments: new Types.ObjectId(commentId) },
//         { $pull: { comments: new Types.ObjectId(commentId) } }
//       );

//       return MESSAGES.COMMENT_DELETED_SUCCESS;
//     } catch (error: any) {
//       throw new Error(MESSAGES.ERROR_DELETING_COMMENT);
//     }
//   }
// }





















import { Types } from "mongoose";
import { BaseRepository, IBaseRepository } from "./baseRepository";
import commentCollection, { IComment } from "../models/commentCollection";
import postsCollection from "../models/postCollection";
import userCollection from "../models/userCollection";
import { MESSAGES } from "../utils/constants";
import logger from "../utils/logger";

export interface ICommentRepository extends IBaseRepository<IComment> {
  addComment(
    userId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
    comment: string
  ): Promise<IComment>;
  addReplyComment(
    userId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
    comment: string,
    parentCommentId: string | Types.ObjectId
  ): Promise<IComment>;
  editComment(commentId: string, comment: string): Promise<IComment>;
  deleteComment(commentId: string): Promise<string>;
}

export class CommentRepository extends BaseRepository<IComment> implements ICommentRepository {
  constructor() {
    super(commentCollection);
  }

  async addComment(
    userId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
    comment: string
  ): Promise<IComment> {
    try {
      userId = new Types.ObjectId(userId);
      postId = new Types.ObjectId(postId);

      // Use the base repository's create method
      const commentData = await this.create({
        userId,
        postId,
        comment,
      });

      // Update user's comments
      await userCollection.updateOne(
        { _id: userId },
        { $addToSet: { comments: commentData._id } }
      );

      // Update post's comments
      await postsCollection.updateOne(
        { _id: postId },
        { $addToSet: { comments: commentData._id } }
      );

      return commentData;
    } catch (error: any) {
      logger.error("AddComment error:", error);
      throw new Error(MESSAGES.ERROR_ADDING_COMMENT);
    }
  }

  async addReplyComment(
    userId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
    comment: string,
    parentCommentId: string | Types.ObjectId
  ): Promise<IComment> {
    try {
      userId = new Types.ObjectId(userId);
      postId = new Types.ObjectId(postId);
      parentCommentId = new Types.ObjectId(parentCommentId);

      // Use the base repository's create method
      const commentData = await this.create({
        userId,
        postId,
        comment,
        parentCommentId,
      });

      // Update parent comment with the reply
      await this.update(parentCommentId, {
        $addToSet: { replies: commentData._id }
      });

      return commentData;
    } catch (error: any) {
      logger.error("AddReplyComment error:", error);
      throw new Error(MESSAGES.ERROR_ADDING_COMMENT);
    }
  }

  async editComment(commentId: string, comment: string): Promise<IComment> {
    try {
      const updatedComment = await this.update(commentId, { comment });
      
      if (!updatedComment) {
        throw new Error(MESSAGES.COMMENT_NOT_FOUND);
      }

      return updatedComment;
    } catch (error: any) {
      logger.error("EditComment error:", error);
      throw new Error(MESSAGES.ERROR_EDITING_COMMENT);
    }
  }

  async deleteComment(commentId: string): Promise<string> {
    try {
      // Soft delete the comment
      await this.update(commentId, { isDeleted: true });

      // Remove comment from replies arrays
      await this.model.updateMany(
        { replies: new Types.ObjectId(commentId) },
        { $pull: { replies: new Types.ObjectId(commentId) } }
      );

      // Remove comment from posts
      await postsCollection.updateMany(
        { comments: new Types.ObjectId(commentId) },
        { $pull: { comments: new Types.ObjectId(commentId) } }
      );

      return MESSAGES.COMMENT_DELETED_SUCCESS;
    } catch (error: any) {
      logger.error("DeleteComment error:", error);
      throw new Error(MESSAGES.ERROR_DELETING_COMMENT);
    }
  }
}