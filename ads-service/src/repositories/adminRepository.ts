// import { Types } from "mongoose";
// import postsCollection from "../models/postsCollection";
// import WeNetAdsCollection from "../models/WeNetAdsCollection";
// import { MESSAGES } from "../utils/constants";
// import logger from "../utils/logger";

// export interface IAdminRepository {
//   getAdsManagementData(skip: number, limit: number): Promise<any[]>;
//   getAdsManagementDocumentCount(): Promise<number>;
//   toggleStatus(postId: string): Promise<any>;
// }

// export default class AdminRepository implements IAdminRepository {
//   async getAdsManagementData(skip: number, limit: number) {
//     try {
//       logger.info(
//         `Fetching Ads Management Data with skip: ${skip}, limit: ${limit}`
//       );

//       const adsManagementData = await WeNetAdsCollection.aggregate([
//         { $sort: { createdAt: 1 } },
//         { $skip: skip },
//         { $limit: limit },
//         {
//           $lookup: {
//             from: "users",
//             localField: "userId",
//             foreignField: "_id",
//             as: "userData",
//           },
//         },
//         {
//           $lookup: {
//             from: "posts",
//             localField: "postId",
//             foreignField: "_id",
//             as: "postData",
//           },
//         },
//         {
//           $lookup: {
//             from: "transactions",
//             localField: "transactionId",
//             foreignField: "_id",
//             as: "transactionData",
//           },
//         },
//       ]);

//       return adsManagementData;
//     } catch (error: any) {
//       logger.error(`Error fetching Ads Management Data: ${error.message}`);

//       throw new Error(error.message);
//     }
//   }
//   async getAdsManagementDocumentCount() {
//     try {
//       logger.info("Fetching Ads Management Document Count");

//       return await WeNetAdsCollection.countDocuments();
//     } catch (error: any) {
//       logger.error(`Error fetching document count: ${error.message}`);

//       throw new Error(error.message);
//     }
//   }
//   async toggleStatus(postId: string) {
//     try {
//       logger.info(`Toggling status for post ID: ${postId}`);

//       const post = await postsCollection.findOne({
//         _id: new Types.ObjectId(postId),
//       });
//       if (!post) {
//         logger.warn(`Post not found: ${postId}`);
//         throw new Error(MESSAGES.ERRORS.POST_NOT_FOUND);
//       }

//       post.WeNetAds.isPromoted = !post.WeNetAds.isPromoted;
//       await post.save();
//       logger.info(`Post status toggled successfully for post ID: ${postId}`);

//       return post;
//     } catch (error: any) {
//       logger.error(`Error toggling post status: ${error.message}`);

//       throw new Error(error.message);
//     }
//   }
// }

































import { Types } from "mongoose";
import { BaseRepository } from "./baseRepository";
import postsCollection, { IPost } from "../models/postsCollection";
import WeNetAdsCollection, { IWeNetAds } from "../models/WeNetAdsCollection";
import { MESSAGES } from "../utils/constants";
import logger from "../utils/logger";



export interface IAdminRepository {
  getAdsManagementData(skip: number, limit: number): Promise<any[]>;
  getAdsManagementDocumentCount(): Promise<number>;
  toggleStatus(postId: string): Promise<IPost>;
}

// Create specialized repositories for each collection
class WeNetAdsRepository extends BaseRepository<IWeNetAds> {
  constructor() {
    super(WeNetAdsCollection);
  }

  async getAdsManagementData(skip: number, limit: number): Promise<any[]> {
    try {
      logger.info(
        `Fetching Ads Management Data with skip: ${skip}, limit: ${limit}`
      );

      return await this.model.aggregate([
        { $sort: { createdAt: 1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "postId",
            foreignField: "_id",
            as: "postData",
          },
        },
        {
          $lookup: {
            from: "transactions",
            localField: "transactionId",
            foreignField: "_id",
            as: "transactionData",
          },
        },
      ]);
    } catch (error: any) {
      logger.error(`Error fetching Ads Management Data: ${error.message}`);
      throw new Error(error.message);
    }
  }
}

class PostRepository extends BaseRepository<IPost> {
  constructor() {
    super(postsCollection);
  }

  async togglePromotionStatus(postId: string): Promise<IPost> {
    try {
      logger.info(`Toggling status for post ID: ${postId}`);

      const post = await this.findOne({
        _id: new Types.ObjectId(postId),
      });

      if (!post) {
        logger.warn(`Post not found: ${postId}`);
        throw new Error(MESSAGES.ERRORS.POST_NOT_FOUND);
      }

      post.WeNetAds.isPromoted = !post.WeNetAds.isPromoted;
      await post.save();
      
      logger.info(`Post status toggled successfully for post ID: ${postId}`);
      return post;
    } catch (error: any) {
      logger.error(`Error toggling post status: ${error.message}`);
      throw new Error(error.message);
    }
  }
}

export default class AdminRepository implements IAdminRepository {
  private wenetAdsRepo: WeNetAdsRepository;
  private postRepo: PostRepository;

  constructor() {
    this.wenetAdsRepo = new WeNetAdsRepository();
    this.postRepo = new PostRepository();
  }

  async getAdsManagementData(skip: number, limit: number): Promise<any[]> {
    return await this.wenetAdsRepo.getAdsManagementData(skip, limit);
  }

  async getAdsManagementDocumentCount(): Promise<number> {
    try {
      logger.info("Fetching Ads Management Document Count");
      return await this.wenetAdsRepo.count();
    } catch (error: any) {
      logger.error(`Error fetching document count: ${error.message}`);
      throw new Error(error.message);
    }
  }

  async toggleStatus(postId: string): Promise<IPost> {
    return await this.postRepo.togglePromotionStatus(postId);
  }
}