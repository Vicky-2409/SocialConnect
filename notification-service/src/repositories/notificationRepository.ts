// import { Types } from "mongoose";
// import notificationCollection, {
//   INotification,
// } from "../models/notificationCollection";
// import userCollection from "../models/userCollection";
// import { MESSAGES } from "../utils/constants";

// export interface INotificationRepository {
//   addNotification(notificationData: INotification): Promise<INotification>;

//   addNotificationToUser(
//     userId: string | Types.ObjectId,
//     notificationId: string | Types.ObjectId
//   ): Promise<string>;

//   getNotifications(userId: string): Promise<INotification[]>;

//   markAsRead(userId: string): Promise<void>;
// }

// export default class NotificationRepository implements INotificationRepository {
//   async addNotification(
//     notificationData: INotification
//   ): Promise<INotification> {
//     try {
//       const notification = await notificationCollection.create(
//         notificationData
//       );
//       return await notification.populate([
//         { path: "doneByUser" },
//         { path: "entityId" },
//       ]);
//     } catch (error: any) {
//       throw new Error(MESSAGES.NOTIFICATION_ERROR);
//     }
//   }
//   async addNotificationToUser(
//     userId: string | Types.ObjectId,
//     notificationId: string | Types.ObjectId
//   ): Promise<string> {
//     try {
//       await userCollection.findByIdAndUpdate(userId, {
//         $set: { $addToSet: { notifications: notificationId } },
//       });
//       return MESSAGES.NOTIFICATION_ADDED_TO_USER;
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }

//   async getNotifications(userId: string): Promise<INotification[]> {
//     try {
//       return await notificationCollection
//         .find({
//           userId: new Types.ObjectId(userId),
//         })
//         .populate("doneByUser")
//         .populate("entityId")
//         .sort({ createdAt: -1 });
//     } catch (error: any) {
//       throw new Error(MESSAGES.NOTIFICATION_ERROR);
//     }
//   }

//   async markAsRead(userId: string) {
//     try {
//       await notificationCollection.updateMany(
//         { userId: new Types.ObjectId(userId), isRead: false },
//         { $set: { isRead: true } }
//       );
//     } catch (error: any) {
//       throw new Error(MESSAGES.NOTIFICATION_ERROR);
//     }
//   }
// }
























import { Types } from "mongoose";
import { BaseRepository, IBaseRepository } from "./baseRepository";
import notificationCollection, {
  INotification,
} from "../models/notificationCollection";
import userCollection from "../models/userCollection";
import { MESSAGES } from "../utils/constants";
import logger from "../utils/logger";

export interface INotificationRepository extends IBaseRepository<INotification> {
  addNotification(notificationData: INotification): Promise<INotification>;
  addNotificationToUser(
    userId: string | Types.ObjectId,
    notificationId: string | Types.ObjectId
  ): Promise<string>;
  getNotifications(userId: string): Promise<INotification[]>;
  markAsRead(userId: string): Promise<void>;
}

export class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository {
  constructor() {
    super(notificationCollection);
  }

  async addNotification(notificationData: INotification): Promise<INotification> {
    try {
      // Use base repository's create method
      const notification = await this.create(notificationData);
      
      // Populate the required fields
      return await notification.populate([
        { path: "doneByUser" },
        { path: "entityId" },
      ]);
    } catch (error: any) {
      logger.error("AddNotification error:", error);
      throw new Error(MESSAGES.NOTIFICATION_ERROR);
    }
  }

  async addNotificationToUser(
    userId: string | Types.ObjectId,
    notificationId: string | Types.ObjectId
  ): Promise<string> {
    try {
      await userCollection.findByIdAndUpdate(userId, {
        $addToSet: { notifications: notificationId },
      });
      
      return MESSAGES.NOTIFICATION_ADDED_TO_USER;
    } catch (error: any) {
      logger.error("AddNotificationToUser error:", error);
      throw new Error(error.message);
    }
  }

  async getNotifications(userId: string): Promise<INotification[]> {
    try {
      // Use the base repository's model with custom query
      return await this.model
        .find({
          userId: new Types.ObjectId(userId),
        })
        .populate("doneByUser")
        .populate("entityId")
        .sort({ createdAt: -1 });
    } catch (error: any) {
      logger.error("GetNotifications error:", error);
      throw new Error(MESSAGES.NOTIFICATION_ERROR);
    }
  }

  async markAsRead(userId: string): Promise<void> {
    try {
      // Use inherited update method for bulk update
      await this.model.updateMany(
        { 
          userId: new Types.ObjectId(userId), 
          isRead: false 
        },
        { 
          $set: { isRead: true } 
        }
      );
    } catch (error: any) {
      logger.error("MarkAsRead error:", error);
      throw new Error(MESSAGES.NOTIFICATION_ERROR);
    }
  }

  // Additional utility methods that leverage base repository functionality
  
  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await this.count({ 
        userId: new Types.ObjectId(userId), 
        isRead: false 
      });
    } catch (error: any) {
      logger.error("GetUnreadCount error:", error);
      throw new Error(MESSAGES.NOTIFICATION_ERROR);
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await this.delete(notificationId);
    } catch (error: any) {
      logger.error("DeleteNotification error:", error);
      throw new Error(MESSAGES.NOTIFICATION_ERROR);
    }
  }
}