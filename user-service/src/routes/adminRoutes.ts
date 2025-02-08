import { Router } from "express";
import { userController, adminController } from "./injection";
import { verifyAdmin } from "../middlewares/verifyAdmin";
const router = Router();

router.post("/login", adminController.login.bind(adminController));

router.get(
  "/usermanagement",
  verifyAdmin,
  adminController.userManagement.bind(adminController)
);
router.get(
  "/dashboardCardData",
  verifyAdmin,
  adminController.dashboardCardData.bind(adminController)
);
router.get(
  "/dashboardChartData",
  verifyAdmin,
  adminController.dashboardChartData.bind(adminController)
);
router.get(
  "/dashboardChartData/AccountType",
  verifyAdmin,
  adminController.dashboardChartDataAccountType.bind(adminController)
);

router.put(
  "/restrictUser/:userId",
  verifyAdmin,
  userController.restrictUser.bind(userController)
);
router.put(
  "/blockUser",
  verifyAdmin,
  userController.blockUser.bind(userController)
);

router.get(
  "/getTickRequestsData",
  verifyAdmin,
  adminController.getTickRequestsData.bind(adminController)
);
router.patch(
  "/changeTickRequestStatus/:requestId",
  verifyAdmin,
  adminController.changeTickRequestStatus.bind(adminController)
);

export default router;
