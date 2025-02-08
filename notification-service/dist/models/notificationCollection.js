"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: "users",
    },
    doneByUser: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: "users",
    },
    type: {
        type: String,
        required: true,
        enum: ["follow", "like", "comment", "restrict", "approved", "rejected"],
    },
    notificationMessage: {
        type: String,
        required: true,
    },
    entityType: {
        type: String,
        required: true,
        enum: ["posts", "users"],
    },
    entityId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        refPath: "entityType",
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("notifications", NotificationSchema);
