"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Types.ObjectId },
    userId: { type: mongoose_1.Types.ObjectId, ref: "users" },
    caption: { type: String },
    imageUrl: { type: String, required: true },
    isDeleted: { type: Boolean, required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("posts", PostSchema);
