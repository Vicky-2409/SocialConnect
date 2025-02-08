"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyUser_1 = require("../middlewares/verifyUser");
const multer_1 = __importDefault(require("../utils/multer"));
const injection_1 = require("./injection");
const router = (0, express_1.Router)();
// router.post(
//   "/createPost/image",
//   verifyUser,
//   upload.single("image"),
//   postController.createPost.bind(postController)
// );
router.post("/createPost/images", verifyUser_1.verifyUser, multer_1.default.array("images", 10), // Allow up to 10 images
injection_1.postController.createPost.bind(injection_1.postController));
router.post("/createPost", verifyUser_1.verifyUser, injection_1.postController.addCaption.bind(injection_1.postController));
router.post("/search", verifyUser_1.verifyUser, injection_1.postController.searchPost.bind(injection_1.postController));
router.get("/singlePost/:postId", verifyUser_1.verifyUser, injection_1.postController.getSinglePost.bind(injection_1.postController));
router.patch("/editPost/:postId", verifyUser_1.verifyUser, injection_1.postController.editPost.bind(injection_1.postController));
router.delete("/deletePost/:postId", verifyUser_1.verifyUser, injection_1.postController.deletePost.bind(injection_1.postController));
router.patch("/toggleLike/:entity/:entityId", verifyUser_1.verifyUser, injection_1.postController.toggleLike.bind(injection_1.postController));
router.patch("/toggleBookmark/:postId", verifyUser_1.verifyUser, injection_1.postController.toggleBookmark.bind(injection_1.postController));
router.get("/publicFeed", injection_1.postController.getPublicFeed.bind(injection_1.postController));
router.get("/feed", verifyUser_1.verifyUser, injection_1.postController.getFeed.bind(injection_1.postController));
router.get("/profileFeed/:username", verifyUser_1.verifyUser, injection_1.postController.getProfileFeed.bind(injection_1.postController));
router.get("/bookmarkedPosts", verifyUser_1.verifyUser, injection_1.postController.getBookmarkedPosts.bind(injection_1.postController));
exports.default = router;
