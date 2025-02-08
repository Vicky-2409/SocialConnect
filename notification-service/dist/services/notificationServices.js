"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("../socket");
const constants_1 = require("../utils/constants");
class NotificationServices {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    addNotification(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield this.notificationRepository.addNotification(notificationData);
                if (!notification)
                    throw new Error(constants_1.MESSAGES.NOTIFICATION_NOT_FOUND);
                (0, socket_1.emitNotification)(notification);
                const { userId } = notificationData;
                const { _id } = notification;
                try {
                    yield this.notificationRepository.addNotificationToUser(userId, _id);
                }
                catch (error) {
                    throw new Error(constants_1.MESSAGES.ERROR_SENDING_LIVE_NOTIFICATION);
                }
            }
            catch (error) {
                throw new Error(constants_1.MESSAGES.ERROR_ADDING_NOTIFICATION);
            }
        });
    }
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notificationData = yield this.notificationRepository.getNotifications(userId);
                yield this.notificationRepository.markAsRead(userId);
                return notificationData;
            }
            catch (error) {
                throw new Error(constants_1.MESSAGES.ERROR_GETTING_NOTIFICATIONS);
            }
        });
    }
}
exports.default = NotificationServices;
