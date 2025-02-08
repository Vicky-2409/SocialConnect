// import { Document, Schema, Types, model } from "mongoose";

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




















import { Document, Schema, Types, model } from "mongoose";

interface IComment extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  parentCommentId?: Types.ObjectId; // New field for nested comments
  comment: string;
  isDeleted: Boolean;
  likedBy: Types.ObjectId[];
  reports: Types.ObjectId[];
  replies?: Types.ObjectId[]; // Reference to child comments
  updatedAt?: Date;
  createdAt?: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "posts", required: true },
    parentCommentId: { type: Schema.Types.ObjectId, ref: "comments", default: null }, // Optional parent comment reference
    comment: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
    likedBy: [{ type: Types.ObjectId, ref: "users" }],
    reports: [{ type: Types.ObjectId, ref: "users" }],
    replies: [{ type: Types.ObjectId, ref: "comments" }], // Array of child comment references
  },
  { timestamps: true }
);

// Add a pre-save middleware to validate parent-child relationship
CommentSchema.pre('save', async function(next) {
  // If this is a reply, validate parent comment exists
  if (this.parentCommentId) {
    const parentComment = await this.model('comments').findById(this.parentCommentId);
    if (!parentComment) {
      return next(new Error('Parent comment does not exist'));
    }
    
    // Add this comment to parent's replies
    await this.model('comments').findByIdAndUpdate(
      this.parentCommentId, 
      { $push: { replies: this._id } }
    );
  }
  next();
});

export default model<IComment>("comments", CommentSchema);

export type { IComment };