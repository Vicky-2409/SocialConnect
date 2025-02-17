import mongoose from "mongoose";
import dotenv from "dotenv";
import { MESSAGES } from "../utils/constants";
import { StatusCode } from "../utils/StatusCode";
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(String(process.env.MONGO_URI));
    console.log(MESSAGES.DB_CONNECTION_SUCCESS);
  } catch (error) {
    console.error(MESSAGES.DB_CONNECTION_FAILED, error);
    process.exit(StatusCode.INTERNAL_SERVER_ERROR);
  }
};
