import { NextFunction, Request, Response } from "express";

import { Types } from "mongoose";
import { IMessageServices } from "../services/messageServices";
import { StatusCode } from "../utils/enum";
import logger from "../utils/logger";

export interface IMessageController {
  getConvoMessages(req: any, res: Response, next: NextFunction): Promise<void>;

  getParticipants(req: any, res: Response, next: NextFunction): Promise<void>;

  createConversation(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  sendMessage(req: any, res: Response, next: NextFunction): Promise<void>;

  deleteMessage(req: any, res: Response, next: NextFunction): Promise<void>;

  getConvoList(req: any, res: Response, next: NextFunction): Promise<void>;

  unreadCount(req: any, res: Response, next: NextFunction): Promise<void>;
}

export default class MessageController implements IMessageController {
  private messageServices: IMessageServices;
  constructor(messageServices: IMessageServices) {
    this.messageServices = messageServices;
  }
  async getConvoMessages(req: any, res: Response, next: NextFunction) {
    try {
      const { convoId } = req.params;
      const userId = req.user._id;
      logger.info(
        `Fetching messages for conversation ID: ${convoId}, user ID: ${userId}`
      );
      const allMessagesData = await this.messageServices.getConvoMessages(
        convoId,
        userId
      );
      logger.info(
        `Successfully fetched messages for conversation ID: ${convoId}`
      );
      res.status(StatusCode.SUCCESS).json(allMessagesData);
    } catch (error: any) {
      logger.error(
        `Error fetching messages for conversation ID: ${req.params.convoId}. Error: ${error.message}`
      );
      next(error);
    }
  }

  async getParticipants(req: any, res: Response, next: NextFunction) {
    try {
      const { convoId } = req.params;

      const userId = new Types.ObjectId(req.user._id);
      logger.info(
        `Fetching participants for conversation ID: ${convoId}, user ID: ${userId}`
      );

      const participantsData = await this.messageServices.getParticipants(
        convoId
      );
      const senderId = participantsData.filter((id) => !id.equals(userId))[0];

      logger.info(
        `Successfully fetched participants for conversation ID: ${convoId}`
      );

      res.status(StatusCode.SUCCESS).json({ curentUserId: userId, senderId });
    } catch (error: any) {
      logger.error(
        `Error fetching participants for conversation ID: ${req.params.convoId}. Error: ${error.message}`
      );

      next(error);
    }
  }

  async createConversation(req: any, res: Response, next: NextFunction) {
    try {
      const { participantId } = req.params;
      const userId = req.user._id;
      logger.info(
        `Creating a new conversation between user ID: ${userId} and participant ID: ${participantId}`
      );

      const conversationData = await this.messageServices.createChat(
        participantId,
        userId
      );
      logger.info(
        `Conversation created successfully between user ID: ${userId} and participant ID: ${participantId}`
      );

      res.status(StatusCode.CREATED).send(conversationData);
    } catch (error: any) {
      logger.error(
        `Error creating conversation between user ID: ${req.user._id} and participant ID: ${req.params.participantId}. Error: ${error.message}`
      );

      next(error);
    }
  }

  async sendMessage(req: any, res: Response, next: NextFunction) {
    try {
      const { convoId } = req.params;
      const { message } = req.body;
      const userId = req.user._id;

      const imageFile = (req.files && req.files[0]) || null;

      logger.info(
        `Sending message for conversation ID: ${convoId} from user ID: ${userId}`
      );

      const latestMessage = await this.messageServices.sendMessage(
        convoId,
        userId,
        message,
        imageFile
      );

      try {
        const result = await this.messageServices.emitSendMessageEvent(
          req,
          latestMessage,
          convoId,
          userId
        );
        logger.info(
          `Message sent and event emitted successfully for conversation ID: ${convoId}`
        );
      } catch (error: any) {
        logger.error(
          `Error emitting send message event for conversation ID: ${convoId}. Error: ${error.message}`
        );

        console.error("Error emitting event:", error.message);
      }

      res.status(StatusCode.SUCCESS).json(latestMessage);
    } catch (error: any) {
      logger.error(
        `Error sending message for conversation ID: ${req.params.convoId}. Error: ${error.message}`
      );

      next(error);
    }
  }

  async deleteMessage(req: any, res: Response, next: NextFunction) {
    try {
      const { convoId } = req.params;
      const { messageId } = req.body;
      const userId = req.user._id;

      logger.info(
        `Deleting message ID: ${messageId} from conversation ID: ${convoId}, user ID: ${userId}`
      );

      const latestMessage = await this.messageServices.deleteMessage(
        convoId,
        userId,
        messageId
      );

      // Emit socket event
      try {
        const result = await this.messageServices.emitSendMessageEvent(
          req,
          latestMessage,
          convoId,
          userId
        );
        logger.info(
          `Message deleted and event emitted successfully for message ID: ${messageId}`
        );
      } catch (error: any) {
        logger.error(
          `Error emitting delete message event for message ID: ${messageId}. Error: ${error.message}`
        );

        console.error("Error emitting event:", error.message);
      }

      res.status(StatusCode.SUCCESS).json(latestMessage);
    } catch (error: any) {
      logger.error(
        `Error deleting message ID: ${req.body.messageId} from conversation ID: ${req.params.convoId}. Error: ${error.message}`
      );

      next(error);
    }
  }

  async getConvoList(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      logger.info(`Fetching conversation list for user ID: ${userId}`);

      const convoListData = await this.messageServices.getConvoList(userId);
      logger.info(
        `Successfully fetched conversation list for user ID: ${userId}`
      );

      res.status(StatusCode.SUCCESS).json(convoListData);
    } catch (error: any) {
      logger.error(
        `Error fetching conversation list for user ID: ${req.user._id}. Error: ${error.message}`
      );

      next(error);
    }
  }

  async unreadCount(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      logger.info(`Fetching unread message count for user ID: ${userId}`);

      const unreadCount = await this.messageServices.unreadCount(userId);
      logger.info(
        `Successfully fetched unread message count for user ID: ${userId}`
      );

      res.status(StatusCode.SUCCESS).json(unreadCount);
    } catch (error: any) {
      logger.error(
        `Error fetching unread message count for user ID: ${req.user._id}. Error: ${error.message}`
      );

      next(error);
    }
  }
}
