import { Router } from "express";
import { messageControllers } from "./injection";
import upload from "../utils/multer";
import { verifyUser } from "../middlewares/verifyUser";
const router = Router();

router.post(
  "/createConversation/:participantId",
  verifyUser,
  messageControllers.createConversation.bind(messageControllers)
);
router.get(
  "/convoList",
  verifyUser,
  messageControllers.getConvoList.bind(messageControllers)
);
router.get(
  "/unreadCount",
  verifyUser,
  messageControllers.unreadCount.bind(messageControllers)
);

router.get(
  "/:convoId",
  verifyUser,
  messageControllers.getConvoMessages.bind(messageControllers)
);
router.get(
  "/participants/:convoId",
  verifyUser,
  messageControllers.getParticipants.bind(messageControllers)
);
router.post(
  "/:convoId",
  verifyUser,
  upload.any(),
  messageControllers.sendMessage.bind(messageControllers)
);
router.post(
  "/delete/:convoId",
  verifyUser,
  messageControllers.deleteMessage.bind(messageControllers)
);

export default router;
