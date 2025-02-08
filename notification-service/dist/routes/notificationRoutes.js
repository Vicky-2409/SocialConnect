"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyUser_1 = require("../middlewares/verifyUser");
const injection_1 = require("./injection");
const router = (0, express_1.Router)();
router.get("/", verifyUser_1.verifyUser, injection_1.notificationController.getNotifications.bind(injection_1.notificationController));
exports.default = router;
