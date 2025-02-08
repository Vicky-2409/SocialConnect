"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentCollection_1 = __importDefault(require("../models/commentCollection"));
const postCollection_1 = __importDefault(require("../models/postCollection"));
const userCollection_1 = __importDefault(require("../models/userCollection"));
const constants_1 = require("../utils/constants");
class CommentRepository {
    addComment(userId, postId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                userId = new mongoose_1.Types.ObjectId(userId);
                postId = new mongoose_1.Types.ObjectId(postId);
                const commentData = yield commentCollection_1.default.create({
                    userId,
                    postId,
                    comment,
                });
                yield userCollection_1.default.updateOne({ _id: userId }, { $addToSet: { comments: commentData._id } });
                yield postCollection_1.default.updateOne({ _id: postId }, { $addToSet: { comments: commentData._id } });
                return commentData;
            }
            catch (error) {
                throw new Error(constants_1.MESSAGES.ERROR_ADDING_COMMENT);
            }
        });
    }
    addReplyComment(userId, postId, comment, parentCommentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                userId = new mongoose_1.Types.ObjectId(userId);
                postId = new mongoose_1.Types.ObjectId(postId);
                const commentData = yield commentCollection_1.default.create({
                    userId,
                    postId,
                    comment,
                    parentCommentId
                });
                return commentData;
            }
            catch (error) {
                throw new Error(constants_1.MESSAGES.ERROR_ADDING_COMMENT);
            }
        });
    }
    // async editComment(commentId: string, comment: string): Promise<IComment> {
    //   try {
    //     const commentData = await commentCollection.findOne({
    //       _id: new Types.ObjectId(commentId),
    //     });
    //     if (!commentData) throw new Error(MESSAGES.COMMENT_NOT_FOUND);
    //     commentData.comment = comment;
    //     await commentData.save();
    //     return commentData;
    //   } catch (error: any) {
    //     throw new Error(MESSAGES.ERROR_EDITING_COMMENT);
    //   }
    // }
    editComment(commentId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedComment = yield commentCollection_1.default.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(commentId) }, { $set: { comment } }, { new: true, returnDocument: "after" });
                if (!updatedComment)
                    throw new Error(constants_1.MESSAGES.COMMENT_NOT_FOUND);
                return updatedComment;
            }
            catch (error) {
                console.error("Error editing comment:", error);
                throw new Error(constants_1.MESSAGES.ERROR_EDITING_COMMENT);
            }
        });
    }
    // async deleteComment(commentId: string): Promise<string> {
    //   try {
    //     await commentCollection.updateOne(
    //       { _id: new Types.ObjectId(commentId) },
    //       { $set: { isDeleted: true } }
    //     );
    // await postsCollection.updateMany(
    //   { comments: new Types.ObjectId(commentId) },
    //   { $pull: { comments: new Types.ObjectId(commentId) } }
    // );
    //     return MESSAGES.COMMENT_DELETED_SUCCESS;
    //   } catch (error: any) {
    //     throw new Error(MESSAGES.ERROR_DELETING_COMMENT);
    //   }
    // }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield commentCollection_1.default.updateOne({ _id: new mongoose_1.Types.ObjectId(commentId) }, { $set: { isDeleted: true } });
                yield commentCollection_1.default.updateMany({ replies: new mongoose_1.Types.ObjectId(commentId) }, { $pull: { replies: new mongoose_1.Types.ObjectId(commentId) } });
                yield postCollection_1.default.updateMany({ comments: new mongoose_1.Types.ObjectId(commentId) }, { $pull: { comments: new mongoose_1.Types.ObjectId(commentId) } });
                return constants_1.MESSAGES.COMMENT_DELETED_SUCCESS;
            }
            catch (error) {
                throw new Error(constants_1.MESSAGES.ERROR_DELETING_COMMENT);
            }
        });
    }
}
exports.default = CommentRepository;
