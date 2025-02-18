"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.userService = exports.postsService = exports.notificationController = void 0;
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const postsRepository_1 = __importDefault(require("../repositories/postsRepository"));
const notificationRepository_1 = __importDefault(require("../repositories/notificationRepository"));
const userServices_1 = __importDefault(require("../services/userServices"));
const postsService_1 = __importDefault(require("../services/postsService"));
const notificationServices_1 = __importDefault(require("../services/notificationServices"));
const notificationController_1 = __importDefault(require("../controllers/notificationController"));
const userRepository = new userRepository_1.default();
const postRepository = new postsRepository_1.default();
const notificationRepository = new notificationRepository_1.default();
const userService = new userServices_1.default(userRepository);
exports.userService = userService;
const postsService = new postsService_1.default(postRepository);
exports.postsService = postsService;
const notificationService = new notificationServices_1.default(notificationRepository);
exports.notificationService = notificationService;
const notificationController = new notificationController_1.default(notificationService);
exports.notificationController = notificationController;
