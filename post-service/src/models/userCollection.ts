import { Schema, Document, model, Types } from "mongoose";

interface IUser extends Document {
  _id: string | Types.ObjectId;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  profilePicUrl: string;
  JWT?: string;
  isRestricted?: boolean;
  posts: string[] | Types.ObjectId[];
  comments: string[] | Types.ObjectId[];
  postsLiked: Types.ObjectId[];
  commentsLiked: Types.ObjectId[];
  reported: string[] | Types.ObjectId[];
  reportsReceived: string[] | Types.ObjectId[];
  postsBookmarked: Types.ObjectId[];
  restrictedFromPostingUntil?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, trim: true, required: true, unique: true },
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    profilePicUrl: { type: String, trim: true },
    posts: [{ type: Types.ObjectId, ref: "posts" }],
    comments: [{ type: Types.ObjectId }],
    postsLiked: [{ type: Types.ObjectId, ref: "posts" }],
    commentsLiked: [{ type: Types.ObjectId }],
    reported: [{ type: Types.ObjectId }],
    reportsReceived: [{ type: Types.ObjectId }],
    postsBookmarked: [{ type: Types.ObjectId, ref: "posts" }],
    restrictedFromPostingUntil: { type: Date }, 
    isRestricted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export default model<IUser>("users", UserSchema);
export type { IUser };