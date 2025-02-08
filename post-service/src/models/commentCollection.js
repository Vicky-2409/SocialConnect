"use strict";
// import { Document, Schema, Types, model } from "mongoose";
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
// interface IComment extends Document {
//   _id: Types.ObjectId;
//   userId: Types.ObjectId;
//   postId: Types.ObjectId;
//   comment: string;
//   isDeleted: Boolean;
//   likedBy: Types.ObjectId[];
//   reports: Types.ObjectId[];
//   updatedAt?: Date;
//   createdAt?: Date;
// }
// const CommentSchema = new Schema<IComment>(
//   {
//     userId: { type: Schema.Types.ObjectId, ref: "users" , required: true},
//     postId: { type: Schema.Types.ObjectId, ref: "posts" , required: true},
//     comment: { type: String, required: true },
//     isDeleted: { type: Boolean, required: true, default: false },
//     likedBy: [{ type: Types.ObjectId, ref: "users" }],
//     reports: [{ type: Types.ObjectId, ref: "users" }],
//   },
//   { timestamps: true }
// );
// export default model<IComment>("comments", CommentSchema);
// export type { IComment };
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "users", required: true },
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "posts", required: true },
    parentCommentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "comments", default: null }, // Optional parent comment reference
    comment: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
    likedBy: [{ type: mongoose_1.Types.ObjectId, ref: "users" }],
    reports: [{ type: mongoose_1.Types.ObjectId, ref: "users" }],
    replies: [{ type: mongoose_1.Types.ObjectId, ref: "comments" }], // Array of child comment references
}, { timestamps: true });
// Add a pre-save middleware to validate parent-child relationship
CommentSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // If this is a reply, validate parent comment exists
        if (this.parentCommentId) {
            const parentComment = yield this.model('comments').findById(this.parentCommentId);
            if (!parentComment) {
                return next(new Error('Parent comment does not exist'));
            }
            // Add this comment to parent's replies
            yield this.model('comments').findByIdAndUpdate(this.parentCommentId, { $push: { replies: this._id } });
        }
        next();
    });
});
exports.default = (0, mongoose_1.model)("comments", CommentSchema);
