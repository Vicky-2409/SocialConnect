import { NextFunction, Request, Response } from "express";
import { IAdminService } from "../services/adminService";
import { StatusCode } from "../utils/enums";
import { MESSAGES } from "../utils/constants";
import logger from "../utils/logger";

export interface IAdminController {
  getAdsManagementData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  toggleStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export default class AdminController implements IAdminController {
  private adminService: IAdminService;

  constructor(adminService: IAdminService) {
    this.adminService = adminService;
  }

  async getAdsManagementData(req: Request, res: Response, next: NextFunction) {
    try {
      // const { pageNo, rowsPerPage } = req.query;

      const pageNo = Number(req.query.pageNo);
const rowsPerPage = Number(req.query.rowsPerPage);

      
      logger.info(
        `Fetching Ads management data - pageNo: ${pageNo}, rowsPerPage: ${rowsPerPage}`
      );

      const data = await this.adminService.getAdsManagementData(
        Number(pageNo),
        Number(rowsPerPage)
      );
      logger.info(`Successfully fetched Ads management data`);

      res.status(StatusCode.OK).send(data);
    } catch (error: any) {
      next(error);
    }
  }

  async toggleStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      logger.info(`Toggling status for postId: ${postId}`);

      const message = await this.adminService.toggleStatus(postId);
      logger.info(`Successfully toggled status for postId: ${postId}`);

      res.status(StatusCode.OK).send({
        message: MESSAGES.TOGGLE_STATUS_SUCCESS,
        data: message,
      });
    } catch (error: any) {
      logger.error(
        `Error toggling status for postId: ${req.params.postId}: ${error.message}`
      );

      next(error);
    }
  }
}
