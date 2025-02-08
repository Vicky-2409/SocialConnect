import mongoose from "mongoose";
import { MESSAGES } from "../utils/constants";
import { StatusCode } from "../utils/enums";
//nnn
export default async (): Promise<void> => {
  try {
    await mongoose.connect(String(process.env.MONGO_URI));
    console.log(MESSAGES.MONGO_CONNECTED);
  } catch (error) {
    console.error(MESSAGES.MONGO_CONNECTION_ERROR, error);
    process.exit(StatusCode.ERROR);
  }
};
