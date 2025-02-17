import { Document, Schema, Types, model } from "mongoose";

interface ITransaction extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  PayUOrderId: Types.ObjectId;
  PayUTransactionId: string;
  transactionStatus: "success" | "failed";
  transactionAmount?: string
}

const TransactionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, ref: "users" },
    PayUOrderId: { type: Types.ObjectId, required: true, ref: "payuorders" },
    PayUTransactionId: { type: String, required: true },
    transactionStatus: {
      type: String,
      required: true,
      enum: ["success", "failed"],
    },
    transactionAmount: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<ITransaction>("transactions", TransactionSchema);

export type { ITransaction };
