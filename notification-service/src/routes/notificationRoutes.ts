import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUser";
import { notificationController } from "./injection";
const router = Router();

router.get(
  "/",
  verifyUser,
  notificationController.getNotifications.bind(notificationController)
);

export default router;
