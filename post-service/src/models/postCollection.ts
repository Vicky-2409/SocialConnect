import { Schema, Types, model, Document } from "mongoose";

interface IPost extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId | string;
  caption: string;
  imageUrls: string[];
  likedBy: Types.ObjectId[];
  comments: Types.ObjectId[];
  isDeleted: boolean;
  WeNetAds: IWeNetAds;
  bookmarkedBy: Types.ObjectId[];
  reports: Types.ObjectId[];
  updatedAt?: Date;
  createdAt?: Date;
}

interface IWeNetAds {
  isPromoted: boolean;
  expiresOn: Date | string;
}

const WeNetAdsSchema = new Schema({
  isPromoted: { type: Boolean, required: true, default: false },
  expiresOn: { type: Date, default: new Date() },
});

const PostSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "users" },
    caption: { type: String },
    imageUrls: { type: [String], required: true },
    likedBy: [{ type: Types.ObjectId, ref: "users" }],
    comments: [{ type: Types.ObjectId, ref: "comments" }],
    isDeleted: { type: Boolean, required: true, default: true },
    WeNetAds: {
      type: WeNetAdsSchema,
      required: true,
      default: { isPromoted: false, expiresOn: new Date() },
    },
    bookmarkedBy: [{ type: Types.ObjectId, ref: "users" }],
    reports: [{ type: Types.ObjectId, ref: "reports" }],
  },
  { timestamps: true }
);

export default model<IPost>("posts", PostSchema);

export type { IPost, IWeNetAds };
