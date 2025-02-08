import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUser";
import { reportsController } from "./injection";
const router = Router();

router.post(
  "/:entityType/:entityId",
  verifyUser,
  reportsController.addReport.bind(reportsController)
);

export default router;
