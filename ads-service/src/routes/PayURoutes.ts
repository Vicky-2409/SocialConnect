import { Router } from "express";
import { paymentController } from "./injection";
const router = Router();

router.post("/payment", paymentController.payment.bind(paymentController));
router.post("/response", paymentController.response.bind(paymentController));
router.post(
  "/response/saveData",
  paymentController.saveData.bind(paymentController)
);

export default router;
