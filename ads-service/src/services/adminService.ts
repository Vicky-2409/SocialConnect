import { IAdminRepository } from "../repositories/adminRepository";
import { IAdsRepository } from "../repositories/adsRepository";
import { MESSAGES } from "../utils/constants";
import logger from "../utils/logger";

export interface IAdminService {
  getAdsManagementData(pageNo: number, rowsPerPage: number): Promise<any>;
  toggleStatus(postId: string): Promise<string>;
}

export default class AdminRepository implements IAdminService {
  private adminRepository: IAdminRepository;
  private adsRepository: IAdsRepository;
  constructor(
    adminRepository: IAdminRepository,
    adsRepository: IAdsRepository
  ) {
    this.adminRepository = adminRepository;
    this.adsRepository = adsRepository;
  }
  async getAdsManagementData(pageNo: number, rowsPerPage: number) {
    try {
      const skip = rowsPerPage * (pageNo - 1);
      const limit = rowsPerPage;

      if (isNaN(skip) || isNaN(limit) || limit <= 0) {
        throw new Error("Invalid skip or limit value");
      }

      logger.info(`Fetching ads with skip: ${skip}, limit: ${limit}`);

      const adsManagementData = await this.adminRepository.getAdsManagementData(
        skip,
        limit
      );

      const responseFormat = adsManagementData.map((data, index) => {
        let { userData, postData, transactionData } = data;

        (userData = userData[0]),
          (postData = postData[0]),
          (transactionData = transactionData[0]);

        const sNo = skip + (index + 1);

        const advertisementId = data._id.toString().toUpperCase();

        const username = userData.username;

        const postImageUrl = postData.imageUrls[0];
        const postId = postData._id;
        const expiresOn = postData.WeNetAds.expiresOn;
        const isActive = postData.WeNetAds.isPromoted;

        const transactionId = transactionData._id.toString().toUpperCase();
        const transactionDate = transactionData.createdAt;
        const transactionAmount = transactionData.transactionAmount;
        const PayUTransactionId =
          transactionData.PayUTransactionId.toString().toUpperCase();

        return {
          sNo,
          advertisementId,
          username,
          postImageUrl,
          postId,
          transactionId,
          transactionDate,
          transactionAmount,
          PayUTransactionId,
          expiresOn,
          isActive,
        };
      });

      const documentCount =
        await this.adminRepository.getAdsManagementDocumentCount();
      logger.info(`Fetched ${documentCount} ads management records`);
      return [responseFormat, documentCount];
    } catch (error: any) {
      logger.error(`Error in getAdsManagementData: ${error.message}`);

      throw new Error(error.message);
    }
  }

  async toggleStatus(postId: string) {
    try {
      logger.info(`Toggling status for postId: ${postId}`);
      const post = await this.adminRepository.toggleStatus(postId);

      try {
        await this.adsRepository.sendPostAdDataToMQ(postId, post.WeNetAds);
      } catch (error: any) {
        console.error(
          `${MESSAGES.ERRORS.FAILED_TO_SEND_MQ}, Error: ${error.message}`
        );
      }
      logger.info(`Post status toggled successfully for postId: ${postId}`);
      return MESSAGES.SUCCESS.AD_STATUS_TOGGLED;
    } catch (error: any) {
      logger.error(
        `Error in toggleStatus for postId ${postId}: ${error.message}`
      );
      throw new Error(error.message);
    }
  }
}
