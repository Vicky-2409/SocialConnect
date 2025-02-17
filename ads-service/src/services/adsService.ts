import { IAdsRepository } from "../repositories/adsRepository";
import { IPayURepository } from "../repositories/PayURepository";
import { MESSAGES } from "../utils/constants";
import logger from "../utils/logger";
import { IUserService } from "./userServices";

export interface IAdsService {
  addTransaction(
    email: string,
    PayUOrderId: string,
    status: "success" | "failed"
  ): Promise<string>;
  getPosts(): Promise<any>;
}

export default class AdsService implements IAdsService {
  private PayURepository: IPayURepository;
  private adsRepository: IAdsRepository;
  private userServices: IUserService;

  constructor(
    PayURepository: IPayURepository,
    adsRepository: IAdsRepository,
    userServices: IUserService
  ) {
    this.PayURepository = PayURepository;
    this.adsRepository = adsRepository;
    this.userServices = userServices;
  }
  async addTransaction(
    email: string,
    PayUOrderId: string,
    status: "success" | "failed"
  ): Promise<string> {
    try {
      logger.info(`Fetching PayU order data for PayUOrderId: ${PayUOrderId}`);

      const PayUOrderData = await this.PayURepository.getPayUOrder(PayUOrderId);
      if (!PayUOrderData) throw new Error(MESSAGES.ERRORS.PAYU_ORDER_NOT_FOUND);

      logger.info("Got order data", { PayUOrderData });



      const userData = await this.userServices.getUserDataByEmail(email);
      if (!userData) throw new Error(MESSAGES.ERRORS.USER_DATA_NOT_FOUND);
      const userId = userData._id.toString();

      const transaction = await this.adsRepository.addTransaction(
        userId,
        PayUOrderId,
        PayUOrderData.mihpayid,
        status,
        PayUOrderData.amount
      );

      if (!transaction)
        throw new Error(MESSAGES.ERRORS.TRANSACTION_DATA_NOT_FOUND);
      logger.info("Transaction added successfully", { transaction });
      if (status === "success") {
        const postId = PayUOrderData?.productinfo;
        logger.info(`Creating WeNetAds for postId: ${postId}`);
        const WeNetAdsData = await this.adsRepository.createWenetAds(
          userId,
          postId,
          transaction._id.toString()
        );
        logger.info("WeNetAdsData created", { WeNetAdsData });


        const postData = await this.adsRepository.addAdDataToPost(postId);

        logger.info("Added ad data to post", { postData });

        try {
          await this.adsRepository.sendPostAdDataToMQ(
            postData._id.toString(),
            postData.WeNetAds
          );
        } catch (error: any) {
          logger.error(
            `Failed to send post ad data to MQ, Error: ${error.message}`
          );
          console.log(error.message);
        }
      }
      return transaction._id.toString();
    } catch (error: any) {
      logger.error(`Error in addTransaction: ${error.message}`);
      throw new Error(error.message);
    }
  }
  async getPosts() {
    try {
      logger.info("Fetching posts data.");
      return await this.adsRepository.getPromotedPosts();
    } catch (error: any) {
      logger.error(`Error in getPosts: ${error.message}`);
      throw new Error(error.message);
    }
  }
}
