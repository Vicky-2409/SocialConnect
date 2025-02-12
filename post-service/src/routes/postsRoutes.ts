import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUser";
import upload from "../utils/multer";
import { postController } from "./injection";

const router = Router();

router.post(
  "/createPost/images",
  verifyUser,
  upload.array("images", 10), // Allow up to 10 images
  postController.createPost.bind(postController)
);

router.post(
  "/createPost",
  verifyUser,
  postController.addCaption.bind(postController)
);
router.post(
  "/search",
  verifyUser,
  postController.searchPost.bind(postController)
);
router.get(
  "/singlePost/:postId",
  verifyUser,
  postController.getSinglePost.bind(postController)
);
router.patch(
  "/editPost/:postId",
  verifyUser,
  postController.editPost.bind(postController)
);
router.delete(
  "/deletePost/:postId",
  verifyUser,
  postController.deletePost.bind(postController)
);
router.patch(
  "/toggleLike/:entity/:entityId",
  verifyUser,
  postController.toggleLike.bind(postController)
);
router.patch(
  "/toggleBookmark/:postId",
  verifyUser,
  postController.toggleBookmark.bind(postController)
);

router.get("/publicFeed", postController.getPublicFeed.bind(postController));
router.get("/feed", verifyUser, postController.getFeed.bind(postController));
router.get(
  "/profileFeed/:username",
  verifyUser,
  postController.getProfileFeed.bind(postController)
);
router.get(
  "/bookmarkedPosts",
  verifyUser,
  postController.getBookmarkedPosts.bind(postController)
);

export default router;
