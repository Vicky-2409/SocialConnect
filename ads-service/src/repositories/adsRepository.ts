import { Types } from "mongoose";
import transactionCollection, {
  ITransaction,
} from "../models/transactionCollection";
import WeNetAdsCollection from "../models/WeNetAdsCollection";
import postsCollection, { IPost } from "../models/postsCollection";
import { MESSAGES, POST_PROMOTION_PERIOD } from "../utils/constants";
import { publisher } from "../rabbitMQ/publisher";
import { MQActions } from "../rabbitMQ/config";
import logger from "../utils/logger";

export interface IAdsRepository {
  addTransaction(
    userId: string,
    PayUOrderId: string,
    PayUTransactionId: string,
    status: "success" | "failed",
    transactionAmount: string
  ): Promise<ITransaction>;

  createWenetAds(
    userId: string,
    postId: string,
    transactionId: string
  ): Promise<any>;

  addAdDataToPost(postId: string): Promise<IPost>;

  sendPostAdDataToMQ(postId: string, WeNetAds: any): Promise<void>;

  getPosts(): Promise<IPost[]>;
}

export default class AdsRepository implements IAdsRepository {
  async addTransaction(
    userId: string,
    PayUOrderId: string,
    PayUTransactionId: string,
    status: "success" | "failed",
    transactionAmount: string
  ): Promise<ITransaction> {
    try {
      logger.info(`Creating transaction for user: ${userId}`);

      const transaction = await transactionCollection.create({
        userId: new Types.ObjectId(userId),
        PayUOrderId: new Types.ObjectId(PayUOrderId),
        PayUTransactionId,
        transactionStatus: status,
        transactionAmount,
      });
      logger.info("Transaction created successfully");

      return transaction;
    } catch (error: any) {
      logger.error(`Error creating transaction: ${error.message}`);

      throw new Error(MESSAGES.ERRORS.TRANSACTION_CREATION_FAILED);
    }
  }
  async createWenetAds(userId: string, postId: string, transactionId: string) {
    try {
      logger.info(`Creating WeNet ad for post: ${postId}`);

      return await WeNetAdsCollection.create({
        userId: new Types.ObjectId(userId),
        postId: new Types.ObjectId(postId),
        transactionId: new Types.ObjectId(transactionId),
      });
    } catch (error: any) {
      logger.error(`Error creating WeNet ad: ${error.message}`);

      throw new Error(MESSAGES.ERRORS.AD_CREATION_FAILED);
    }
  }
  async addAdDataToPost(postId: string): Promise<IPost> {
    try {
      logger.info(`Adding ad data to post: ${postId}`);

      const postData = await postsCollection.findById(postId);
      if (!postData) {
        logger.warn(`Post not found: ${postId}`);

        throw new Error(MESSAGES.ERRORS.POST_NOT_FOUND);
      }

      const currentDate = new Date();
      const promotionPeriod = POST_PROMOTION_PERIOD;

      if (postData.WeNetAds.isPromoted) {
        // Extend the expiresOn date
        const expiresOnDate = new Date(postData.WeNetAds.expiresOn);
        postData.WeNetAds.expiresOn = new Date(
          expiresOnDate.getTime() + promotionPeriod * 24 * 60 * 60 * 1000
        );
      } else {
        // Set the promotion start date to today and the end date
        postData.WeNetAds.isPromoted = true;
        postData.WeNetAds.expiresOn = new Date(
          currentDate.getTime() + promotionPeriod * 24 * 60 * 60 * 1000
        );
      }

      await postData.save();
      logger.info("Ad data added to post successfully");

      return postData;
    } catch (error: any) {
      logger.error(`Error adding ad data to post: ${error.message}`);

      throw new Error(error.message);
    }
  }
  async sendPostAdDataToMQ(postId: string, WeNetAds: any) {
    try {
      logger.info(`Sending post ad data to MQ for post ID: ${postId}`);

      const adsServiceMessageData = { postId, WeNetAds };
      await publisher.publishAdsServiceMessage(
        adsServiceMessageData,
        MQActions.addWeNetAd
      );
    } catch (error: any) {
      logger.error(`Error sending post ad data to MQ: ${error.message}`);

      throw new Error(error.message);
    }
  }
  async getPosts() {
    try {
      logger.info("Fetching promoted posts");

      const currentDate = new Date();
      const postData = await postsCollection
        .find({
          isDeleted: false,
          "WeNetAds.isPromoted": true,
          "WeNetAds.expiresOn": { $gt: currentDate },
        })
        .populate("userId");

      if (!postData || postData.length === 0) {
        logger.info("No promoted posts found");

        return [];
      }
      logger.info("Promoted posts fetched successfully");

      return postData;
    } catch (error: any) {
      logger.error(`Error fetching promoted posts: ${error.message}`);

      throw new Error(error.message);
    }
  }
}
