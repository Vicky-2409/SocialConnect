import mongoose from "mongoose";
import { MongoDB } from "../utils/constants";

export default async (): Promise<void> => {
  try {
    await mongoose.connect(String(process.env.MONGO_URI));
    console.log(MongoDB.SUCCESS);
  } catch (error) {
    console.error(MongoDB.ERROR, error);
    process.exit(1);
  }
};
