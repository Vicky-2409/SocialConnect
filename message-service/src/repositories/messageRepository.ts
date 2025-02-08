import { Types } from "mongoose";
import conversationsCollection, {
  IConversation,
} from "../models/conversationsCollection";
import { uploadToS3Bucket } from "../utils/s3bucket";
import { IMulterFile } from "../types/types";
import messageCollection, { IMessage } from "../models/messageCollection";
import userCollection, { IUser } from "../models/userCollection";
import { emitSocketEvent } from "../socket";
import { ChatEventEnum, MESSAGES } from "../utils/constants";


export interface IMessageRepository {
  createConversation(
    participantId: string,
    userId: string
  ): Promise<IConversation>;

  addConversationToUser(
    userId: string,
    conversationId: string | Types.ObjectId
  ): Promise<IUser>;

  getParticipants(convoId: string): Promise<Types.ObjectId[]>;

  saveMessage(
    convoId: string,
    senderId: string,
    message: string
  ): Promise<IMessage>;

  deleteMessage(
    convoId: string,
    senderId: string,
    messageId: string
  ): Promise<IMessage>;

  uploadImage(imageFile: unknown): Promise<string>;

  saveImage(
    convoId: string,
    senderId: string,
    imageUrl: string
  ): Promise<IMessage>;

  saveLastMessage(
    convoId: string,
    lastMessage: string,
    messageId: Types.ObjectId,
    unreadByUser: Types.ObjectId
  ): Promise<IConversation>;

  getLastMessage(convoId: string): Promise<IConversation>;

  getAllMessages(convoId: string): Promise<IMessage[]>;

  markAsRead(convoId: string, userId: string): Promise<void>;

  getConvoList(userId: string): Promise<IConversation[]>;

  getConvoData(convoId: string): Promise<IConversation>;

  emitSendMessageEvent(
    req: any,
    receivedMessage: any,
    convoId: string,
    senderId: any
  ): Promise<string>;
}

export default class MessageRepository implements IMessageRepository{
  async createConversation(
    participantId: string,
    userId: string
  ): Promise<IConversation> {
    try {
      // Check if a conversation already exists between the two users
      const existingConversation = await conversationsCollection.findOne({
        participants: {
          $all: [new Types.ObjectId(participantId), new Types.ObjectId(userId)],
        },
      });

      // If a conversation exists, return it
      if (existingConversation) {
        return existingConversation;
      }

      // If no conversation exists, create a new one
      return await conversationsCollection.create({
        participants: [
          new Types.ObjectId(participantId),
          new Types.ObjectId(userId),
        ],
        lastMessage: "",
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addConversationToUser(
    userId: string,
    conversationId: string | Types.ObjectId
  ): Promise<IUser> {
    try {
      const updatedUser = await userCollection.findByIdAndUpdate(
        new Types.ObjectId(userId),
        {
          $addToSet: {
            singleConversations: new Types.ObjectId(conversationId),
          },
        },
        { new: true }
      );

      if (!updatedUser) throw new Error(MESSAGES.USER_NOT_FOUND);

      return updatedUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getParticipants(convoId: string): Promise<Types.ObjectId[]> {
    try {
      const conversationsData = await conversationsCollection.findOne({
        _id: new Types.ObjectId(convoId),
      });

      if (!conversationsData) {
        throw new Error(MESSAGES.CONVO_NOT_FOUND);
      }
      return conversationsData.participants;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async saveMessage(
    convoId: string,
    senderId: string,
    message: string
  ): Promise<IMessage> {
    try {
      if (!message) throw new Error(MESSAGES.NO_MESSAGE);

      const convoExists = await conversationsCollection.exists({
        _id: convoId,
      });
      if (!convoExists) throw new Error(MESSAGES.CONVO_EXISTS);
      const senderExists = await userCollection.exists({ _id: senderId });
      if (!senderExists) throw new Error(MESSAGES.SENDER_NOT_FOUND);
      const newMessage = await messageCollection.create({
        convoId: new Types.ObjectId(convoId),
        sender: new Types.ObjectId(senderId),
        message,
      });

      return await newMessage.populate({
        path: "sender",
        select: "_id username firstName lastName profilePicUrl",
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteMessage(
    convoId: string,
    senderId: string,
    messageId: string
  ): Promise<IMessage> {
    try {
      if (!messageId) throw new Error(MESSAGES.INVALID_MESSAGE_ID); // Validate the messageId

      const convoExists = await conversationsCollection.exists({
        _id: convoId,
      });
      if (!convoExists) throw new Error(MESSAGES.CONVO_EXISTS);

      const senderExists = await userCollection.exists({ _id: senderId });
      if (!senderExists) throw new Error(MESSAGES.SENDER_NOT_FOUND);

      // Use $set to update the isDeleted field to true
      const deletedMessage = await messageCollection.findByIdAndUpdate(
        messageId,
        {
          $set: { isDeleted: true }, // Use $set to mark the message as deleted
        },
        { new: true } // This will return the updated document instead of the original one
      );

      if (!deletedMessage) {
        throw new Error(MESSAGES.MESSAGE_NOT_FOUND);
      }

      // return deletedMessage; // Return the updated message (now marked as deleted)

      return await deletedMessage.populate({
        path: "sender",
        select: "_id username firstName lastName profilePicUrl",
      });
    } catch (error: any) {
      throw new Error(error.message); // Handle error if message not deleted
    }
  }

  async uploadImage(imageFile: unknown): Promise<string> {
    try {
      return await uploadToS3Bucket(imageFile as IMulterFile);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async saveImage(
    convoId: string,
    senderId: string,
    imageUrl: string
  ): Promise<IMessage> {
    try {
      const newMessage = await messageCollection.create({
        convoId: new Types.ObjectId(convoId),
        sender: new Types.ObjectId(senderId),
        message: String(""),
        isAttachment: true,
        attachmentUrl: imageUrl,
      });

      return newMessage.populate({
        path: "sender",
        select: "_id username firstName lastName profilePicUrl",
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async saveLastMessage(
    convoId: string,
    lastMessage: string,
    messageId: Types.ObjectId,
    unreadByUser: Types.ObjectId
  ): Promise<IConversation> {
    try {
      const convoData = await conversationsCollection.findByIdAndUpdate(
        convoId,
        {
          $set: { lastMessage },
          $addToSet: { unread: [messageId, unreadByUser] },
        },
        { new: true }
      );

      if (!convoData) throw new Error(MESSAGES.LAST_MESSAGE_UPDATE_FAILED);

      return convoData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getLastMessage(convoId: string): Promise<IConversation> {
    try {
      const convoData = await conversationsCollection.findById(convoId);

      if (!convoData) throw new Error(MESSAGES.CONVO_NOT_FOUND);

      return convoData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllMessages(convoId: string): Promise<IMessage[]> {
    try {
      const allMessagesData = await messageCollection
        .find({ convoId: new Types.ObjectId(convoId) })
        .populate({
          path: "sender",
          select: "_id username firstName lastName profilePicUrl",
        })
        .sort({ updatedAt: -1 });

      return allMessagesData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async markAsRead(convoId: string, userId: string) {
    try {

      const convoData = await conversationsCollection.findById(convoId);

      if (!convoData) throw new Error(MESSAGES.CONVO_NOT_FOUND);

      convoData.unread = convoData.unread.filter(
        (unreadItem: any) => unreadItem[1].toString() !== userId
      );

      await convoData.save();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getConvoList(userId: string): Promise<IConversation[]> {
    try {
      return await conversationsCollection
        .find({ participants: new Types.ObjectId(userId) })
        .populate({
          path: "participants",
          select: "_id username firstName lastName profilePicUrl",
        })
        .sort({ updatedAt: -1 });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getConvoData(convoId: string): Promise<IConversation> {
    try {
      const convoData = await conversationsCollection
        .findOne({ _id: new Types.ObjectId(convoId) })
        .populate({
          path: "participants",
          select: "_id username firstName lastName profilePicUrl",
        })
        .sort({ updatedAt: -1 });
      if (!convoData) throw new Error("No convo data found");

      return convoData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  //socket methods
  async emitSendMessageEvent(
    req: any,
    receivedMessage: any,
    convoId: string,
    senderId: any
  ): Promise<string> {
    try {
      const conversation = await conversationsCollection.findByIdAndUpdate(
        convoId
      );
      if (!conversation) throw new Error(MESSAGES.CONVO_ERROR);

      conversation.participants.forEach((participantObjectId) => {
        if (participantObjectId.toString() === senderId.toString()) return;

        console.log(participantObjectId.toString());

        emitSocketEvent(
          req,
          participantObjectId.toString(),
          ChatEventEnum.MESSAGE_RECEIVED_EVENT,
          receivedMessage
        );
        emitSocketEvent(
          req,
          senderId.toString(),
          ChatEventEnum.MESSAGE_SENT_EVENT,
          receivedMessage
        );
      });

      return MESSAGES.MESSAGE_EMITTED_SUCCESS;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}


