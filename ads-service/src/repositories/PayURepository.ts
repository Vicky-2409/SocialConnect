import { Types } from "mongoose";
import PayUOrderCollection, { IPayUOrder } from "../models/PayUOrderCollection";
import logger from "../utils/logger";

export interface IPayURepository {
  getPayUOrder(PayUOrderId: string): Promise<IPayUOrder | null>;
}

export default class PayURepository implements IPayURepository {
  async getPayUOrder(PayUOrderId: string): Promise<IPayUOrder | null> {
    try {
      logger.info(`Fetching PayU order with ID: ${PayUOrderId}`);

      return await PayUOrderCollection.findOne({
        _id: new Types.ObjectId(PayUOrderId),
      });
    } catch (error: any) {
      logger.error(`Error fetching PayU order: ${error.message}`);
      throw new Error(error.message);
    }
  }
}
