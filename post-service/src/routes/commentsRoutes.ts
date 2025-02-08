import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUser";
import { commentController } from "./injection";
const router = Router();

router.post(
  "/createReply",
  verifyUser,
  commentController.addReplyComment.bind(commentController)
);
router.post(
  "/:postId",
  verifyUser,
  commentController.addComment.bind(commentController)
);
router.patch(
  "/:commentId",
  verifyUser,
  commentController.editComment.bind(commentController)
);
router.delete(
  "/:commentId",
  verifyUser,
  commentController.deleteComment.bind(commentController)
);

export default router;
