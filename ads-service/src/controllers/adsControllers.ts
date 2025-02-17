import { NextFunction, Request, Response } from "express";
import { IAdsService } from "../services/adsService";
import { StatusCode } from "../utils/enums";
import { MESSAGES } from "../utils/constants";
import logger from "../utils/logger";

export interface IAdsController {
  addTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getPosts(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export default class AdsController implements IAdsController {
  private adsService: IAdsService;

  constructor(adsService: IAdsService) {
    this.adsService = adsService;
  }

  async addTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { PayUOrderId, email, status } = req.body;
      
      logger.info(
        `Received transaction data - PayUOrderId: ${PayUOrderId}, email: ${email}, status: ${status}`
      );



      const transactionId = await this.adsService.addTransaction(
        email,
        PayUOrderId,
        status
      );
      logger.info(
        `Transaction added successfully - TransactionId${transactionId}`
      );

      res.status(StatusCode.OK).send(transactionId);
    } catch (error: any) {
      logger.error(`Error adding transaction: ${error.message}`);

      next(error);
    }
  }

  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("Fetching posts...");

      const data = await this.adsService.getPosts();
      logger.info(
        `Successfully retrieved posts - Number of posts: ${data.length}`
      );

      res.status(StatusCode.OK).send({
        message: MESSAGES.POSTS_RETRIEVED,
        data,
      });
    } catch (error: any) {
      logger.error(`Error retrieving posts: ${error.message}`);

      next(error);
    }
  }
}
