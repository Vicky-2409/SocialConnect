import { INotification } from "../models/notificationCollection";
import { INotificationRepository } from "../repositories/notificationRepository";
import { emitNotification } from "../socket";
import { MESSAGES } from "../utils/constants";

export interface INotificationServices {
  addNotification(notificationData: INotification): Promise<void>;
  getNotifications(userId: string): Promise<INotification[]>;
}

export default class NotificationServices {
  private notificationRepository: INotificationRepository;
  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository;
  }
  async addNotification(notificationData: INotification) {
    try {
      const notification = await this.notificationRepository.addNotification(
        notificationData
      );

      if (!notification) throw new Error(MESSAGES.NOTIFICATION_NOT_FOUND);
      emitNotification(notification);
      const { userId } = notificationData;
      const { _id } = notification;
      try {
        await this.notificationRepository.addNotificationToUser(userId, _id);
      } catch (error: any) {
        throw new Error(MESSAGES.ERROR_SENDING_LIVE_NOTIFICATION);
      }
    } catch (error: any) {
      throw new Error(MESSAGES.ERROR_ADDING_NOTIFICATION);
    }
  }
  async getNotifications(userId: string) {
    try {
      const notificationData =
        await this.notificationRepository.getNotifications(userId);
      await this.notificationRepository.markAsRead(userId);
      return notificationData;
    } catch (error: any) {
      throw new Error(MESSAGES.ERROR_GETTING_NOTIFICATIONS);
    }
  }
}
