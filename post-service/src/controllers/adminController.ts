import { Request, NextFunction, Response } from "express";
import {IAdminService} from "../services/adminServices";
import { StatusCode } from "../utils/StatusCode";
import { MESSAGES } from "../utils/constants";
import logger from "../utils/logger";


export interface IAdminController {
  getReportsData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  resolveReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getDashboardCardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}



export default class AdminController implements IAdminController{

  private adminServices: IAdminService

  constructor( adminServices: IAdminService){
    this.adminServices =  adminServices
  }
  async getReportsData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    logger.info("Entering getReportsData method");
    try {
      const { pageNo, rowsPerPage } = req.query;
      logger.debug(`Received query params - pageNo: ${pageNo}, rowsPerPage: ${rowsPerPage}`);
      const reportsData = await this.adminServices.getReportsData( Number(pageNo),
      Number(rowsPerPage));
      logger.info("Successfully retrieved reports data");
      res.status(StatusCode.OK).send(reportsData);
    } catch (error:any) {
      logger.error(`Error in getReportsData: ${error.message}`, { error });
      next(error);
    }
  }


   async resolveReport(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { reportId } = req.params;
      logger.debug(`Received reportId: ${reportId}`);
      const message = await this.adminServices.resolveReport(reportId);
      logger.info("Successfully resolved report");
      res.status(StatusCode.OK).send({message});
    } catch (error:any) {
      logger.error(`Error in resolveReport: ${error.message}`, { error });
      next(error);
    }
  }



   async getDashboardCardData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    logger.info("Entering getDashboardCardData method");
    try {
      const [totalPosts, totalReports] =
        await this.adminServices.getDashboardCardData();
        logger.info("Successfully retrieved dashboard card data");
      res.status(StatusCode.OK).send([totalPosts, totalReports]);
    } catch (error:any) {
      logger.error(`Error in getDashboardCardData: ${error.message}`, { error });
      next(error);
    }
  }
}



