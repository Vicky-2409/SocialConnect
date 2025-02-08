import { Router } from "express";
import { adminController, postController } from "./injection";

import { verifyAdmin } from "../middlewares/verifyAdmin";
const router = Router();

router.get(
  "/reports",
  verifyAdmin,
  adminController.getReportsData.bind(adminController)
);
router.patch(
  "/reports/:reportId",
  verifyAdmin,
  adminController.resolveReport.bind(adminController)
);

router.delete(
  "/deletePost/:postId",
  verifyAdmin,
  postController.deletePost.bind(postController)
);

router.get(
  "/getDashboardCardData",
  verifyAdmin,
  adminController.getDashboardCardData.bind(adminController)
);

export default router;
