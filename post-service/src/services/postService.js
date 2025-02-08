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
const config_1 = require("../rabbitMq/config");
const constants_1 = require("../utils/constants");
class PostsServices {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    uploadImage(imageFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postsRepository.uploadImage(imageFile);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    createPost(userId, imageUrls) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postData = yield this.postsRepository.createPost(userId, imageUrls);
                if (!postData)
                    throw new Error(constants_1.MESSAGES.POST_NOT_FOUND);
                return postData;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    searchPost(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postData = yield this.postsRepository.searchPost(keyword);
                if (!postData)
                    throw new Error(constants_1.MESSAGES.POST_NOT_FOUND);
                return postData;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    addCaption(postId, caption, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postData = yield this.postsRepository.addCaption(postId, caption);
                if (!postData)
                    throw new Error(constants_1.MESSAGES.POST_NOT_FOUND);
                //To notification service
                try {
                    const { _id, caption, imageUrls, isDeleted } = postData;
                    yield this.postsRepository.sendPostDataToMQ(_id, userId, caption, imageUrls, isDeleted, config_1.MQActions.addPost);
                }
                catch (error) {
                    console.log(error.message);
                }
                //To ads service
                try {
                    const { _id, caption, imageUrls, isDeleted, WeNetAds } = postData;
                    yield this.postsRepository.sendPostDataToAdsMQ(_id, userId, caption, imageUrls, isDeleted, WeNetAds, config_1.MQActions.addPost);
                }
                catch (error) {
                    console.log(error.message);
                }
                return postData;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getSinglePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postsRepository.getSinglePost(postId);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    editPost(postId, caption) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postsRepository.editPost(postId, caption);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postsRepository.deletePost(postId);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    toggleLike(entity, entityId, currUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.postsRepository.toggleLike(entity, entityId, currUserId);
                try {
                    const userId = post.userId.toString();
                    const doneByUser = currUserId;
                    const postId = post._id.toString();
                    const postIsLiked = yield this.postsRepository.postIsLiked(doneByUser, postId);
                    if (userId !== doneByUser && postIsLiked == true) {
                        yield this.postsRepository.sendNotificationToMQ(userId, doneByUser, "like", `Liked your ${entity}`, "posts", postId);
                    }
                }
                catch (error) {
                    console.log(error.message);
                }
                return (post === null || post === void 0 ? void 0 : post.likedBy) || [];
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    toggleBookmark(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postsRepository.toggleBookmark(postId, userId);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    postIsLiked(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postsRepository.postIsLiked(userId, postId);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    postIsBookmarked(userId, bookmarkedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postsRepository.postIsBookmarked(userId, bookmarkedBy);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getTopPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postsRepository.getTopPosts();
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getBookmarkedPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postsRepository.getBookmarkedPosts(userId);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getProfilePosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postsRepository.getProfilePosts(userId);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    createWeNetAd(postId, WeNetAds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postData = yield this.postsRepository.createWeNetAd(postId, WeNetAds);
                if (!postData)
                    throw new Error(constants_1.MESSAGES.POST_NOT_FOUND);
                return constants_1.MESSAGES.AD_DATA_ADDED_TO_POST;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = PostsServices;
