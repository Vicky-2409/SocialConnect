import mongoose from 'mongoose';
import { MESSAGES } from '../utils/constants';
import { StatusCode } from '../utils/enum';
//
export default async (): Promise<void> => {
  try {
    await mongoose.connect(String(process.env.MONGO_URI));
    console.log(MESSAGES.SUCCESS.DB_CONNECTED);

  } catch (error) {
    console.error(`${MESSAGES.ERROR.DB_CONNECTION_FAILED}: ${error}`);
    process.exit(StatusCode.INTERNAL_SERVER_ERROR);
  }
};