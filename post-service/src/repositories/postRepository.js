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
const postCollection_1 = __importDefault(require("../models/postCollection"));
const s3bucket_1 = require("../utils/s3bucket");
const userCollection_1 = __importDefault(require("../models/userCollection"));
const publisher_1 = require("../rabbitMq/publisher");
const config_1 = require("../rabbitMq/config");
const constants_1 = require("../utils/constants");
class PostRepository {
    uploadImage(imageFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, s3bucket_1.uploadToS3Bucket)(imageFile);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    createPost(userId, imageUrls) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postData = { userId, imageUrls };
                return yield postCollection_1.default.create(postData);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    searchPost(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const regex = new RegExp(keyword, "i");
                const postData = yield postCollection_1.default
                    .find({
                    $or: [
                        { caption: { $regex: regex } }, // Direct field search
                    ],
                })
                    .populate({
                    path: "userId",
                    select: "username firstName lastName profilePicUrl",
                })
                    .exec();
                return postData;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    addCaption(postId, caption) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = new mongoose_1.Types.ObjectId(postId);
                const post = yield postCollection_1.default.findOne({ _id });
                if (!post) {
                    throw new Error(constants_1.MESSAGES.POST_NOT_FOUND);
                }
                const updatedPost = Object.assign(Object.assign({}, post._doc), { caption, isDeleted: false });
                const result = yield postCollection_1.default.findOneAndUpdate({ _id }, { $set: updatedPost }, { new: true } // new: true returns the updated document
                );
                if (!result) {
                    throw new Error(constants_1.MESSAGES.POST_NOT_FOUND);
                }
                yield userCollection_1.default.updateOne({ _id: result.userId }, { $addToSet: { posts: result._id } });
                return result;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    // },
    getPostData(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield postCollection_1.default.findOne({
                    _id: new mongoose_1.Types.ObjectId(postId),
                });
                if (!post)
                    throw new Error(constants_1.MESSAGES.POST_NOT_FOUND);
                return post;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    // async getSinglePost(postId: string): Promise<IPost> {
    //   try {
    //     const _id = new Types.ObjectId(postId);
    //     const postData = await postsCollection
    //       .findOne({ _id })
    //       .populate({
    //         path: "comments",
    //         populate: {
    //           path: "userId",
    //           select: "username profilePicUrl", // Adjust as necessary
    //         },
    //       })
    //       .populate({
    //         path: "likedBy", // Populate likedBy field
    //         select: "username profilePicUrl", // Select fields you want from the user model
    //       })
    //       .exec();
    //     if (!postData) throw new Error(MESSAGES.POST_NOT_FOUND);
    //     if (postData.isDeleted) throw new Error(MESSAGES.POST_ALREADY_DELETED);
    //     return postData;
    //   } catch (error: any) {
    //     throw new Error(error.message);
    //   }
    // }
    getSinglePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = new mongoose_1.Types.ObjectId(postId);
                const postData = yield postCollection_1.default
                    .findOne({ _id })
                    .populate({
                    path: "comments",
                    populate: [
                        {
                            path: "userId", // Populate userId field in comments
                            select: "username profilePicUrl", // Adjust as necessary
                        },
                        {
                            path: "replies", // Populate replies field in comments
                            populate: {
                                path: "userId", // Populate userId for each reply
                                select: "username profilePicUrl", // Adjust as necessary
                            }
                        }
                    ]
                })
                    .populate({
                    path: "likedBy", // Populate likedBy field
                    select: "username profilePicUrl", // Select fields you want from the user model
                })
                    .exec();
                if (!postData)
                    throw new Error(constants_1.MESSAGES.POST_NOT_FOUND);
                if (postData.isDeleted)
                    throw new Error(constants_1.MESSAGES.POST_ALREADY_DELETED);
                return postData;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    editPost(postId, caption) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = new mongoose_1.Types.ObjectId(postId);
                const post = yield postCollection_1.default.findOne({ _id });
                if (!post)
                    throw new Error(constants_1.MESSAGES.POST_NOT_FOUND);
                if (post.isDeleted)
                    throw new Error(constants_1.MESSAGES.POST_ALREADY_DELETED);
                const updatedPost = Object.assign(Object.assign({}, post._doc), { caption, isDeleted: false });
                yield postCollection_1.default.findOneAndUpdate({ _id }, { $set: updatedPost });
                return constants_1.MESSAGES.POST_EDITED_SUCCESSFULLY;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = new mongoose_1.Types.ObjectId(postId);
                const post = yield postCollection_1.default.findOne({ _id });
                if (!post)
                    throw new Error(constants_1.MESSAGES.POST_NOT_FOUND);
                if (post.isDeleted)
                    throw new Error(constants_1.MESSAGES.POST_ALREADY_DELETED);
                const updatedPost = Object.assign(Object.assign({}, post._doc), { isDeleted: true });
                yield postCollection_1.default.findOneAndUpdate({ _id }, { $set: updatedPost });
                return constants_1.MESSAGES.POST_DELETED_SUCCESSFULLY;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    toggleLike(entity, entityId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Convert IDs to ObjectId
                userId = new mongoose_1.Types.ObjectId(userId);
                entityId = new mongoose_1.Types.ObjectId(entityId);
                // Find the user
                const user = yield userCollection_1.default.findOne({ _id: userId });
                if (!user)
                    throw new Error(constants_1.MESSAGES.USER_NOT_FOUND);
                if (entity === "post") {
                    // Find the post
                    const post = yield postCollection_1.default.findOne({ _id: entityId });
                    if (!post)
                        throw new Error(constants_1.MESSAGES.POST_NOT_FOUND);
                    // Check if the user has already liked the post
                    const postIndex = user.postsLiked.findIndex((postId) => postId.equals(entityId));
                    if (postIndex !== -1) {
                        // Unlike Post
                        user.postsLiked.splice(postIndex, 1);
                        const likedByIndex = post.likedBy.findIndex((userIdItem) => userIdItem.equals(userId));
                        if (likedByIndex !== -1) {
                            post.likedBy.splice(likedByIndex, 1);
                        }
                    }
                    else {
                        // Like Post
                        user.postsLiked.push(entityId);
                        post.likedBy.push(userId);
                    }
                    // Save changes to user and post
                    yield user.save();
                    yield post.save();
                    // Populate the likedBy array with user details
                    const updatedPost = yield postCollection_1.default
                        .findOne({ _id: entityId })
                        .populate({
                        path: "likedBy", // Field to populate
                        select: "username profilePicUrl", // Fields to include
                    });
                    if (!updatedPost)
                        throw new Error(constants_1.MESSAGES.POST_NOT_FOUND_AFTER_UPDATE);
                    return updatedPost; // Return the populated post
                }
                else {
                    throw new Error(constants_1.MESSAGES.INVALID_ENTITY_TYPE);
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    toggleBookmark(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                userId = new mongoose_1.Types.ObjectId(userId);
                const user = yield userCollection_1.default.findOne({ _id: userId });
                if (!user)
                    throw new Error(constants_1.MESSAGES.USER_NOT_FOUND);
                postId = new mongoose_1.Types.ObjectId(postId);
                const postIndex = user.postsBookmarked.findIndex((id) => id.equals(postId));
                let message;
                if (postIndex !== -1) {
                    //remove bookmark
                    user.postsBookmarked.splice(postIndex, 1);
                    yield postCollection_1.default.updateOne({ _id: postId }, { $pull: { bookmarkedBy: userId } });
                    message = constants_1.MESSAGES.POST_REMOVED_FROM_BOOKMARK;
                }
                else {
                    //add bookmark
                    user.postsBookmarked.push(postId);
                    yield postCollection_1.default.updateOne({ _id: postId }, { $addToSet: { bookmarkedBy: userId } });
                    message = constants_1.MESSAGES.POST_ADDED_TO_BOOKMARK;
                }
                yield user.save();
                return message;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    postIsLiked(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userCollection_1.default
                    .findById(userId)
                    .select("postsLiked")
                    .exec();
                if (!user) {
                    throw new Error(constants_1.MESSAGES.USER_NOT_FOUND);
                }
                const isLiked = user.postsLiked.includes(postId);
                return isLiked;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    postIsBookmarked(userId, bookmarkedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isBookmarked = bookmarkedBy.includes(userId);
                return isBookmarked;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getTopPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield postCollection_1.default.aggregate([
                    {
                        $match: { isDeleted: false },
                    },
                    {
                        $addFields: {
                            likesCount: { $size: "$likedBy" },
                        },
                    },
                    {
                        $sort: { likesCount: -1 },
                    },
                    {
                        $sort: { createdAt: -1 },
                    },
                    {
                        $limit: 35,
                    },
                    {
                        $project: {
                            _id: 1,
                        },
                    },
                ]);
                return posts.map((post) => post._id.toString());
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getBookmarkedPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userCollection_1.default
                    .findById(userId)
                    .select("postsBookmarked")
                    .exec();
                if (!user) {
                    throw new Error(constants_1.MESSAGES.USER_NOT_FOUND);
                }
                // Return the array of bookmarked post IDs
                return user.postsBookmarked.map((postId) => postId.toString());
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    sendPostDataToMQ(postId, userId, caption, imageUrls, isDeleted, action) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postData = {
                    _id: postId,
                    userId,
                    caption,
                    imageUrl: imageUrls[0],
                    isDeleted,
                };
                yield publisher_1.publisher.publishPostMessageToNotification(postData, action);
            }
            catch (error) {
                console.error("Error sending user data to MQ:", error.message);
                throw new Error(error.message);
            }
        });
    }
    sendNotificationToMQ(userId, doneByUser, type, notificationMessage, entityType, entityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //notification data to publish:
                const notificationData = {
                    userId,
                    doneByUser,
                    type,
                    notificationMessage,
                    entityType,
                    entityId,
                };
                yield publisher_1.publisher.publishNotificationMessage(notificationData, config_1.MQActions.addNotification);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getProfilePosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield postCollection_1.default.aggregate([
                    {
                        $match: { userId: new mongoose_1.Types.ObjectId(userId), isDeleted: false },
                    },
                    {
                        $addFields: {
                            likesCount: { $size: "$likedBy" },
                        },
                    },
                    {
                        $sort: { createdAt: -1 },
                    },
                    {
                        $limit: 35,
                    },
                    {
                        $project: {
                            _id: 1,
                        },
                    },
                ]);
                return posts.map((post) => post._id.toString());
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    sendPostDataToAdsMQ(postId, userId, caption, imageUrls, isDeleted, WeNetAds, action) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postData = {
                    _id: postId,
                    userId,
                    caption,
                    imageUrls,
                    isDeleted,
                    WeNetAds,
                };
                yield publisher_1.publisher.publishPostForAdsMessage(postData, action);
            }
            catch (error) {
                console.error("Error sending user data to MQ:", error.message);
                throw new Error(error.message);
            }
        });
    }
    createWeNetAd(postId, WeNetAds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield postCollection_1.default.findOne({
                    _id: new mongoose_1.Types.ObjectId(postId),
                });
                if (!post)
                    throw new Error(constants_1.MESSAGES.POST_NOT_FOUND);
                post.WeNetAds = WeNetAds;
                post.save();
                return post;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = PostRepository;
