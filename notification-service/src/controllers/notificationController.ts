import { NextFunction, Response, Request } from "express";
import { INotificationServices } from "../services/notificationServices";
import { StatusCode } from "../utils/StatusCode";
import { MESSAGES } from "../utils/constants";
import logger from "../utils/logger";

export interface INotificationController {
  getNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

export default class NotificationController implements INotificationController {
  private notificationServices: INotificationServices;
  constructor(notificationServices: INotificationServices) {
    this.notificationServices = notificationServices;
  }

  async getNotifications(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      logger.info(`Fetching notifications for user ID: ${userId}`);
      const notification = await this.notificationServices.getNotifications(
        userId
      );
      logger.info(`Successfully fetched notifications for user ID: ${userId}`);
      res
        .status(StatusCode.OK)
        .json({
          message: MESSAGES.NOTIFICATIONS_FETCH_SUCCESS,
          data: notification,
        });
    } catch (error: any) {
      logger.error(
        `Error while fetching notifications for user ID: ${req.user._id}. Error: ${error.message}`
      );
      next(error);
    }
  }
}
