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
const StatusCode_1 = require("../utils/StatusCode");
const constants_1 = require("../utils/constants");
const logger_1 = __importDefault(require("../utils/logger"));
class NotificationController {
    constructor(notificationServices) {
        this.notificationServices = notificationServices;
    }
    getNotifications(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user._id;
                logger_1.default.info(`Fetching notifications for user ID: ${userId}`);
                const notification = yield this.notificationServices.getNotifications(userId);
                logger_1.default.info(`Successfully fetched notifications for user ID: ${userId}`);
                res.status(StatusCode_1.StatusCode.OK).json({ message: constants_1.MESSAGES.NOTIFICATIONS_FETCH_SUCCESS, data: notification });
            }
            catch (error) {
                logger_1.default.error(`Error while fetching notifications for user ID: ${req.user._id}. Error: ${error.message}`);
                next(error);
            }
        });
    }
}
exports.default = NotificationController;
