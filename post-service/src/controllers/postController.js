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
const userCollection_1 = __importDefault(require("../models/userCollection"));
const StatusCode_1 = require("../utils/StatusCode");
const logger_1 = __importDefault(require("../utils/logger"));
class PostController {
    constructor(postsServices, userServices) {
        this.postsServices = postsServices;
        this.userServices = userServices;
    }
    // async createPost(req: any, res: Response, next: NextFunction): Promise<void> {
    //   try {
    //     console.log(req.body.formData);
    //     const imageFile = req.file;
    //     if (!imageFile) {
    //       logger.error("Image file not found in createPost");
    //       throw new Error(MESSAGES.IMAGE_FILE_NOT_FOUND);
    //     }
    //     const imageUrl = await this.postsServices.uploadImage(imageFile);
    //     const userId = req.user._id;
    //     const postData = await this.postsServices.createPost(userId, imageUrl);
    //     logger.info(`Post created by user ${userId}`);
    //     res.status(StatusCode.OK).send({ postData });
    //   } catch (error: any) {
    //     logger.error(`Error in createPost: ${error.message}`);
    //     next(error);
    //   }
    // }
    createPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.files || req.files.length === 0) {
                    res.status(400).json("No images uploaded");
                }
                const userId = req.user._id;
                const uploadedFiles = req.files;
                const imageUrls = [];
                for (const file of uploadedFiles) {
                    try {
                        const result = yield this.postsServices.uploadImage(file);
                        imageUrls.push(result);
                    }
                    catch (error) {
                        console.error("Error processing image:", error);
                        continue;
                    }
                }
                if (imageUrls.length === 0) {
                    res.status(500).json("Failed to process any images");
                }
                const postData = yield this.postsServices.createPost(userId, imageUrls);
                logger_1.default.info(`Post created by user ${userId}`);
                res.status(StatusCode_1.StatusCode.OK).send({ postData });
            }
            catch (error) {
                logger_1.default.error(`Error in createPost: ${error.message}`);
                next(error);
            }
        });
    }
    addCaption(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, caption } = req.body.data;
                console.log(_id, caption);
                const userId = req.user._id;
                const postData = yield this.postsServices.addCaption(_id, caption, userId);
                logger_1.default.info(`Caption added to post ${_id} by user ${userId}`);
                res.status(StatusCode_1.StatusCode.OK).send(postData);
            }
            catch (error) {
                logger_1.default.error(`Error in addCaption: ${error.message}`);
                next(error);
            }
        });
    }
    searchPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { keyword } = req.body.params;
                const postData = yield this.postsServices.searchPost(keyword);
                res.status(StatusCode_1.StatusCode.OK).send(postData);
            }
            catch (error) {
                logger_1.default.error(`Error in addCaption: ${error.message}`);
                next(error);
            }
        });
    }
    getSinglePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const { userId, imageUrls, caption, likedBy, comments, updatedAt, createdAt, bookmarkedBy, } = yield this.postsServices.getSinglePost(postId);
                const { username, firstName, lastName, profilePicUrl } = yield this.userServices.getUser(userId);
                const isLiked = yield this.postsServices.postIsLiked(req.user._id, postId);
                const isBookmarked = yield this.postsServices.postIsBookmarked(req.user._id, bookmarkedBy);
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
                };
                logger_1.default.info(`Post ${postId} retrieved successfully`);
                res.status(StatusCode_1.StatusCode.OK).json(postData);
            }
            catch (error) {
                logger_1.default.error(`Error in getSinglePost: ${error.message}`);
                next(error);
            }
        });
    }
    editPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const { caption } = req.body;
                const message = yield this.postsServices.editPost(postId, caption);
                logger_1.default.info(`Post ${postId} edited successfully`);
                res.status(StatusCode_1.StatusCode.OK).send(message);
            }
            catch (error) {
                logger_1.default.error(`Error in editPost: ${error.message}`);
                next(error);
            }
        });
    }
    deletePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const message = yield this.postsServices.deletePost(postId);
                logger_1.default.info(`Post ${postId} deleted successfully`);
                res.status(StatusCode_1.StatusCode.OK).send(message);
            }
            catch (error) {
                logger_1.default.error(`Error in deletePost: ${error.message}`);
                next(error);
            }
        });
    }
    toggleLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.user;
                const { entity, entityId } = req.params;
                const entityCount = yield this.postsServices.toggleLike(entity, entityId, _id);
                logger_1.default.info(`Like toggled on ${entity} ${entityId} by user ${_id}`);
                res.status(StatusCode_1.StatusCode.OK).send(entityCount);
            }
            catch (error) {
                logger_1.default.error(`Error in toggleLike: ${error.message}`);
                next(error);
            }
        });
    }
    toggleBookmark(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.user;
                const { postId } = req.params;
                logger_1.default.info(`User ${_id} is toggling bookmark for post ${postId}`);
                const message = yield this.postsServices.toggleBookmark(postId, _id);
                res.status(StatusCode_1.StatusCode.OK).send(message);
            }
            catch (error) {
                logger_1.default.error(`Error in toggleBookmark: ${error.message}`);
                next(error);
            }
        });
    }
    getPublicFeed(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("Fetching top posts for public feed");
            try {
                const topPosts = yield this.postsServices.getTopPosts();
                let topPostsData = topPosts.map((postId) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { userId, imageUrls, caption, likedBy, comments, updatedAt, createdAt, } = yield this.postsServices.getSinglePost(postId);
                        const { username, firstName, lastName, profilePicUrl } = yield this.userServices.getUser(userId);
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
                    }
                    catch (error) {
                        console.log(error);
                        logger_1.default.error(`Error fetching post details for post ${postId}: ${error.message}`);
                        return null;
                    }
                }));
                topPostsData = yield Promise.all(topPostsData);
                res.status(StatusCode_1.StatusCode.OK).json({ topPostsData });
            }
            catch (error) {
                logger_1.default.error(`Error in getPublicFeed: ${error.message}`);
                next(error);
            }
        });
    }
    getFeed(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currUserId = req.user._id;
                logger_1.default.info(`Fetching feed for user ${currUserId}`);
                const topPosts = yield this.postsServices.getTopPosts();
                let topPostsData = topPosts.map((postId) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { userId, imageUrls, caption, likedBy, comments, updatedAt, createdAt, } = yield this.postsServices.getSinglePost(postId);
                        const { username, firstName, lastName, profilePicUrl } = yield this.userServices.getUser(userId);
                        const isLiked = yield this.postsServices.postIsLiked(req.user._id, postId);
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
                    }
                    catch (error) {
                        console.log(error);
                        logger_1.default.error(`Error fetching post details for post ${postId}: ${error.message}`);
                        return null;
                    }
                }));
                topPostsData = yield Promise.all(topPostsData);
                res.status(StatusCode_1.StatusCode.OK).json({ topPostsData });
            }
            catch (error) {
                logger_1.default.error(`Error in getFeed: ${error.message}`);
                next(error);
            }
        });
    }
    getBookmarkedPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user._id;
                logger_1.default.info(`Fetching bookmarked posts for user: ${userId}`);
                const bookmarkedPosts = yield this.postsServices.getBookmarkedPosts(req.user._id);
                logger_1.default.info(`Found ${bookmarkedPosts.length} bookmarked posts for user: ${userId}`);
                let postsData = bookmarkedPosts.map((postId) => __awaiter(this, void 0, void 0, function* () {
                    const { userId, imageUrls, caption, likedBy, comments, updatedAt, createdAt, } = yield this.postsServices.getSinglePost(postId);
                    const { username, firstName, lastName, profilePicUrl } = yield this.userServices.getUser(userId);
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
                }));
                postsData = yield Promise.all(postsData);
                res.status(StatusCode_1.StatusCode.OK).json(postsData);
            }
            catch (error) {
                logger_1.default.error(`Error fetching post data ${error.message}`);
                next(error);
            }
        });
    }
    getProfileFeed(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                logger_1.default.info(`Fetching profile feed for user: ${username}`);
                const user = yield userCollection_1.default.findOne({ username });
                if (!user) {
                    logger_1.default.warn(`User with username: ${username} not found`);
                    throw new Error("User not found");
                }
                const posts = yield this.postsServices.getProfilePosts(user._id.toString());
                logger_1.default.info(`Found ${posts.length} posts for user: ${username}`);
                let postsData = posts.map((postId) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { userId, imageUrls, caption, likedBy, comments, updatedAt, createdAt, } = yield this.postsServices.getSinglePost(postId);
                        const { username, firstName, lastName, profilePicUrl } = yield this.userServices.getUser(userId);
                        const isLiked = yield this.postsServices.postIsLiked(req.user._id, postId);
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
                    }
                    catch (error) {
                        console.log(error);
                        logger_1.default.error(`Error fetching post data for postId: ${postId} - ${error.message}`);
                        return null;
                    }
                }));
                postsData = yield Promise.all(postsData);
                res.status(StatusCode_1.StatusCode.OK).json(postsData);
            }
            catch (error) {
                logger_1.default.error(`Error in getProfileFeed: ${error.message}`);
                next(error);
            }
        });
    }
}
exports.default = PostController;
