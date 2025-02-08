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
Object.defineProperty(exports, "__esModule", { value: true });
class CommentsServices {
    constructor(commentsRepository, postsRepository) {
        (this.commentsRepository = commentsRepository),
            (this.postsRepository = postsRepository);
    }
    addComment(currUserId, postId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentData = yield this.commentsRepository.addComment(currUserId, postId, comment);
                const postData = yield this.postsRepository.getPostData(commentData.postId);
                try {
                    const userId = postData.userId.toString();
                    const doneByUser = currUserId;
                    const postId = commentData.postId;
                    if (userId !== doneByUser) {
                        yield this.postsRepository.sendNotificationToMQ(userId, doneByUser, "comment", `Commented on your post`, "posts", postId);
                    }
                }
                catch (error) {
                    console.log(error.message);
                }
                return commentData;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    addReplyComment(currUserId, postId, comment, parentCommentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentData = yield this.commentsRepository.addReplyComment(currUserId, postId, comment, parentCommentId);
                const postData = yield this.postsRepository.getPostData(commentData.postId);
                try {
                    const userId = postData.userId.toString();
                    const doneByUser = currUserId;
                    const postId = commentData.postId;
                    if (userId !== doneByUser) {
                        yield this.postsRepository.sendNotificationToMQ(userId, doneByUser, "comment", `Commented on your post`, "posts", postId);
                    }
                }
                catch (error) {
                    console.log(error.message);
                }
                return commentData;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    editComment(commentId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentData = yield this.commentsRepository.editComment(commentId, comment);
                const commentRes = commentData.comment;
                return commentRes;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.commentsRepository.deleteComment(commentId);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = CommentsServices;
