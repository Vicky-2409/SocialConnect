import { ObjectId, Types } from "mongoose";
import { IConversation } from "../models/conversationsCollection";
import { IMessage } from "../models/messageCollection";
import { IMessageRepository } from "../repositories/messageRepository";
import { MESSAGES } from "../utils/constants";

export interface IMessageServices {
  getConvoMessages(convoId: string, userId: string): Promise<IMessage[]>;

  getParticipants(convoId: string): Promise<Types.ObjectId[]>;

  createChat(participantId: string, userId: string): Promise<IConversation>;

  sendMessage(
    convoId: string,
    senderId: string,
    message: string,
    imageFile: Express.Multer.File | null
  ): Promise<IMessage>;

  deleteMessage(
    convoId: string,
    senderId: string,
    messageId: string
  ): Promise<IMessage>;

  emitSendMessageEvent(
    req: any,
    receivedMessage: any,
    convoId: string,
    senderId: any
  ): Promise<string>;

  getConvoList(userId: string): Promise<
    {
      convoId: string;
      username: string;
      firstName: string;
      lastName: string;
      profilePicUrl: string;
      timestamp: Date;
      lastMessage: string;
      unreadCount: number;
    }[]
  >;

  unreadCount(userId: string): Promise<number>;
}

export default class MessageServices implements IMessageServices {
  private messageRepository: IMessageRepository;
  constructor(messageRepository: IMessageRepository) {
    this.messageRepository = messageRepository;
  }
  async getConvoMessages(convoId: string, userId: string): Promise<IMessage[]> {
    try {
      const messageData = await this.messageRepository.getAllMessages(convoId);

      await this.messageRepository.markAsRead(convoId, userId);

      return messageData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getParticipants(convoId: string): Promise<Types.ObjectId[]> {
    try {
      const participantsData = await this.messageRepository.getParticipants(
        convoId
      );
      return participantsData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createChat(
    participantId: string,
    userId: string
  ): Promise<IConversation> {
    try {
      const conversationData: IConversation =
        await this.messageRepository.createConversation(participantId, userId);

      await this.messageRepository.addConversationToUser(
        userId,
        conversationData._id
      );

      return conversationData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async sendMessage(
    convoId: string,
    senderId: string,
    message: string,
    imageFile: Express.Multer.File | null
  ): Promise<IMessage> {
    try {
      let messageData;

      if (imageFile) {
        const imageUrl = await this.messageRepository.uploadImage(imageFile);
        messageData = await this.messageRepository.saveImage(
          convoId,
          senderId,
          imageUrl
        );

        if (!messageData) {
          throw new Error(MESSAGES.FAILED_TO_SAVE_MESSAGE);
        }

        const convoData = await this.messageRepository.getConvoData(convoId);
        const { participants } = convoData;

        const unreadByUser = participants.filter(
          (participant) => participant._id.toString() !== senderId
        )[0];

        await this.messageRepository.saveLastMessage(
          convoId,
          "📎attachment",
          messageData._id,
          unreadByUser
        );

        return messageData;
      }

      //This repository method saves the message to the message collection
      messageData = await this.messageRepository.saveMessage(
        convoId,
        senderId,
        message
      );

      //This repository method saves the last message to the conversation collection
      const convoData = await this.messageRepository.getConvoData(convoId);
      const { participants } = convoData;
      const unreadByUser = participants.filter(
        (participant) => participant._id.toString() != senderId
      )[0];
      await this.messageRepository.saveLastMessage(
        convoId,
        message,
        messageData._id,
        unreadByUser
      );

      return messageData;
    } catch (error) {
      console.error("Error in sendMessage:", error);
      throw error;
    }
  }

  async deleteMessage(
    convoId: string,
    senderId: string,
    messageId: string
  ): Promise<IMessage> {
    try {
      //This repository method saves the message to the message collection
      const messageData = await this.messageRepository.deleteMessage(
        convoId,
        senderId,
        messageId
      );

      const Data: IConversation = await this.messageRepository.getLastMessage(
        convoId
      );

      const lastUnreadArray = Data?.unread?.[Data.unread.length - 1]; // Get the last array in `unread`
      const lastUnreadMessagee = lastUnreadArray?.[0]; // Get the last element of the last array

      if (String(lastUnreadMessagee) === String(messageData._id)) {
        //This repository method saves the last message to the conversation collection
        const convoData = await this.messageRepository.getConvoData(convoId);
        const { participants } = convoData;
        const unreadByUser = participants.filter(
          (participant) => participant._id.toString() != senderId
        )[0];
        await this.messageRepository.saveLastMessage(
          convoId,
          MESSAGES.MESSAGE_DELETED,
          messageData._id,
          unreadByUser
        );
      }

      return messageData;
    } catch (error) {
      console.error("Error in sendMessage:", error);
      throw error;
    }
  }

  async emitSendMessageEvent(
    req: any,
    receivedMessage: any,
    convoId: string,
    senderId: any
  ): Promise<string> {
    try {
      return await this.messageRepository.emitSendMessageEvent(
        req,
        receivedMessage,
        convoId,
        senderId
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getConvoList(userId: string) : Promise<{
    convoId: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicUrl: string;
    timestamp: Date;
    lastMessage: string;
    unreadCount: number;
  }[]> {
    try {
      const convoListData = await this.messageRepository.getConvoList(userId);

      const responseFormat =
        convoListData.length > 0
          ? convoListData.map((data) => {
              const { _id, participants, lastMessage, unread, updatedAt } =
                data;

              const otherParticipant = participants.filter(
                (participant) => participant._id.toString() != userId
              )[0];

              const { username, firstName, lastName, profilePicUrl } =
                otherParticipant as any;

              const unreadCount = unread.filter(
                (data: any) => data[1].toString() == userId
              ).length;

              return {
                convoId: _id.toString(), 
                username: String(username), 
                firstName: String(firstName),
                lastName: String(lastName),
                profilePicUrl: String(profilePicUrl),
                timestamp: new Date(updatedAt), 
                lastMessage,
                unreadCount,
              };
            })
          : [];
      return responseFormat;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async unreadCount(userId: string) {
    try {
      const convoListData = await this.messageRepository.getConvoList(userId);

      let unreadCount = 0;
      convoListData.forEach((data) => {
        const { unread } = data;
        unreadCount += unread.filter(
          (data: any) => data[1].toString() == userId
        ).length;
      });

      return unreadCount;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
