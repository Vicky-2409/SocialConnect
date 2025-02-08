import { Router } from "express";
import { adminController } from "./injection";
import { verifyAdmin } from "../middlewares/verifyAdmin";
const router = Router();

router.get(
  "/adsManagementData",
  verifyAdmin,
  adminController.getAdsManagementData.bind(adminController)
);
router.patch(
  "/toggleStatus/:postId",
  verifyAdmin,
  adminController.toggleStatus.bind(adminController)
);

export default router;
