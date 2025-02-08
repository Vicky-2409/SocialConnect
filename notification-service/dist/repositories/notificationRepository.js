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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notificationCollection_1 = __importDefault(require("../models/notificationCollection"));
const userCollection_1 = __importDefault(require("../models/userCollection"));
const constants_1 = require("../utils/constants");
class NotificationRepository {
    addNotification(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield notificationCollection_1.default.create(notificationData);
                return yield notification.populate([
                    { path: "doneByUser" },
                    { path: "entityId" },
                ]);
            }
            catch (error) {
                throw new Error(constants_1.MESSAGES.NOTIFICATION_ERROR);
            }
        });
    }
    addNotificationToUser(userId, notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield userCollection_1.default.findByIdAndUpdate(userId, {
                    $set: { $addToSet: { notifications: notificationId } },
                });
                return constants_1.MESSAGES.NOTIFICATION_ADDED_TO_USER;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield notificationCollection_1.default
                    .find({
                    userId: new mongoose_1.Types.ObjectId(userId),
                })
                    .populate("doneByUser")
                    .populate("entityId")
                    .sort({ createdAt: -1 });
            }
            catch (error) {
                throw new Error(constants_1.MESSAGES.NOTIFICATION_ERROR);
            }
        });
    }
    markAsRead(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield notificationCollection_1.default.updateMany({ userId: new mongoose_1.Types.ObjectId(userId), isRead: false }, { $set: { isRead: true } });
            }
            catch (error) {
                throw new Error(constants_1.MESSAGES.NOTIFICATION_ERROR);
            }
        });
    }
}
exports.default = NotificationRepository;
;
