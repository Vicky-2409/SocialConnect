"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, trim: true, required: true, unique: true },
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    profilePicUrl: { type: String, trim: true },
    posts: [{ type: mongoose_1.Types.ObjectId, ref: "posts" }],
    comments: [{ type: mongoose_1.Types.ObjectId }],
    postsLiked: [{ type: mongoose_1.Types.ObjectId, ref: "posts" }],
    commentsLiked: [{ type: mongoose_1.Types.ObjectId }],
    reported: [{ type: mongoose_1.Types.ObjectId }],
    reportsReceived: [{ type: mongoose_1.Types.ObjectId }],
    postsBookmarked: [{ type: mongoose_1.Types.ObjectId, ref: "posts" }],
    restrictedFromPostingUntil: { type: Date },
    isRestricted: { type: Boolean, required: true, default: false },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("users", UserSchema);
