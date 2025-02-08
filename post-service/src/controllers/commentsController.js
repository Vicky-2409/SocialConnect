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
const StatusCode_1 = require("../utils/StatusCode");
const logger_1 = __importDefault(require("../utils/logger"));
class CommentController {
    constructor(commentsServices, userServices) {
        (this.commentsServices = commentsServices),
            (this.userServices = userServices);
    }
    addReplyComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("Entering addReplyComment method");
            try {
                const { postId, parentCommentId, content } = req.body.data;
                console.log(req.body.data, "//////////////////////////////////////////////");
                const id = req.user._id;
                logger_1.default.debug(`addComment - postId: ${postId}, parentCommentId ${parentCommentId}, userId: ${id}, comment: ${content}`);
                const { userId, updatedAt, _id } = yield this.commentsServices.addReplyComment(id, postId, content, parentCommentId);
                logger_1.default.info(`Comment added successfully with ID: ${_id}`);
                const { username, profilePicUrl } = yield this.userServices.getUser(userId);
                logger_1.default.debug(`Fetched user details - username: ${username}, profilePicUrl: ${profilePicUrl}`);
                const commentData = {
                    _id,
                    userId,
                    profilePicUrl,
                    username,
                    content,
                    updatedAt,
                };
                res.status(StatusCode_1.StatusCode.OK).send(commentData);
            }
            catch (error) {
                logger_1.default.error(`Error in addReplyComment: ${error.message}`, { error });
                next(error);
            }
        });
    }
    addComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("Entering addComment method");
            try {
                const { postId } = req.params;
                console.log(req.params, "//////////////////////////////////////////////");
                const id = req.user._id;
                const { comment } = req.body;
                logger_1.default.debug(`addComment - postId: ${postId}, userId: ${id}, comment: ${comment}`);
                const { userId, updatedAt, _id } = yield this.commentsServices.addComment(id, postId, comment);
                logger_1.default.info(`Comment added successfully with ID: ${_id}`);
                const { username, profilePicUrl } = yield this.userServices.getUser(userId);
                logger_1.default.debug(`Fetched user details - username: ${username}, profilePicUrl: ${profilePicUrl}`);
                const commentData = {
                    _id,
                    userId,
                    profilePicUrl,
                    username,
                    comment,
                    updatedAt,
                };
                res.status(StatusCode_1.StatusCode.OK).send(commentData);
            }
            catch (error) {
                logger_1.default.error(`Error in addComment: ${error.message}`, { error });
                next(error);
            }
        });
    }
    deleteComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("Entering deleteComment method");
            try {
                const { commentId } = req.params;
                logger_1.default.debug(`deleteComment - commentId: ${commentId}`);
                const result = yield this.commentsServices.deleteComment(commentId);
                logger_1.default.info(`Comment deleted successfully with ID: ${commentId}`);
                res.status(StatusCode_1.StatusCode.OK).send(result);
            }
            catch (error) {
                logger_1.default.error(`Error in deleteComment: ${error.message}`, { error });
                next(error);
            }
        });
    }
    editComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("Entering editComment method");
            try {
                const { commentId } = req.params;
                const { comment } = req.body;
                logger_1.default.debug(`editComment - commentId: ${commentId}, updatedComment: ${comment}`);
                const commentRes = yield this.commentsServices.editComment(commentId, comment);
                logger_1.default.info(`Comment edited successfully with ID: ${commentId}`);
                res.status(StatusCode_1.StatusCode.OK).send(commentRes);
            }
            catch (error) {
                logger_1.default.error(`Error in editComment: ${error.message}`, { error });
                next(error);
            }
        });
    }
}
exports.default = CommentController;
