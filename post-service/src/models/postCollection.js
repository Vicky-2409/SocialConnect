"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const WeNetAdsSchema = new mongoose_1.Schema({
    isPromoted: { type: Boolean, required: true, default: false },
    expiresOn: { type: Date, default: new Date() },
});
const PostSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Types.ObjectId, ref: "users" },
    caption: { type: String },
    imageUrls: { type: [String], required: true },
    likedBy: [{ type: mongoose_1.Types.ObjectId, ref: "users" }],
    comments: [{ type: mongoose_1.Types.ObjectId, ref: "comments" }],
    isDeleted: { type: Boolean, required: true, default: true },
    WeNetAds: {
        type: WeNetAdsSchema,
        required: true,
        default: { isPromoted: false, expiresOn: new Date() },
    },
    bookmarkedBy: [{ type: mongoose_1.Types.ObjectId, ref: "users" }],
    reports: [{ type: mongoose_1.Types.ObjectId, ref: "reports" }],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("posts", PostSchema);
