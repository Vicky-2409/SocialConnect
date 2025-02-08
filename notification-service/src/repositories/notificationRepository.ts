import { Types } from "mongoose";
import notificationCollection, {
  INotification,
} from "../models/notificationCollection";
import userCollection from "../models/userCollection";
import { MESSAGES } from "../utils/constants";


export interface INotificationRepository {
  addNotification(notificationData: INotification): Promise<INotification>;

  addNotificationToUser(
    userId: string | Types.ObjectId,
    notificationId: string | Types.ObjectId
  ): Promise<string>;

  getNotifications(userId: string): Promise<INotification[]>;

  markAsRead(userId: string): Promise<void>;
}


export default class NotificationRepository implements INotificationRepository {
  async addNotification (
    notificationData: INotification
  ): Promise<INotification> {
    try {
      const notification = await notificationCollection.create(notificationData)
      return await notification.populate([
        { path: "doneByUser" },
        { path: "entityId" },
      ]);
      
    } catch (error: any) {
      throw new Error(MESSAGES.NOTIFICATION_ERROR); 
    }
  }
  async addNotificationToUser (
    userId: string | Types.ObjectId,
    notificationId: string | Types.ObjectId
  ): Promise<string> {
    try {
      await userCollection.findByIdAndUpdate(userId, {
        $set: { $addToSet: { notifications: notificationId } },
      });
      return MESSAGES.NOTIFICATION_ADDED_TO_USER;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getNotifications(userId: string): Promise<INotification[]> {
    try {
      return await notificationCollection
        .find({
          userId: new Types.ObjectId(userId),
        })
        .populate("doneByUser")
        .populate("entityId")
        .sort({ createdAt: -1 });
    } catch (error: any) {
      throw new Error(MESSAGES.NOTIFICATION_ERROR);
    }
  }




  


  async markAsRead(userId: string) {
    try {
      await notificationCollection.updateMany(
        { userId: new Types.ObjectId(userId), isRead: false },
        { $set: { isRead: true } }
      );
    } catch (error: any) {
      throw new Error(MESSAGES.NOTIFICATION_ERROR);
    }
  }


};

