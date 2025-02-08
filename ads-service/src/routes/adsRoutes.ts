import { Router } from "express";
import { adsController } from "./injection";
import { verifyUser } from "../middlewares/verifyUser";
const router = Router();

router.post(
  "/addTransaction",
  adsController.addTransaction.bind(adsController)
);
router.get("/getPosts", verifyUser, adsController.getPosts.bind(adsController));

export default router;
