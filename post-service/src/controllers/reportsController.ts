import { NextFunction, Request, Response } from "express";
import {IReportsService} from "../services/reportsService";
import { StatusCode } from "../utils/StatusCode";
import logger from "../utils/logger";

export interface IReportsController {
  addReport(req: any, res: Response, next: NextFunction): Promise<void>;
}

export default class ReportsController implements IReportsController{
  private reportsService:IReportsService
  constructor(reportsService:IReportsService){
    this.reportsService = reportsService
  }
  async addReport(req: any, res: Response, next: NextFunction) {
    try {
      const { entityType, entityId } = req.params;
      const { reportType, reportDescription } = req.body;

      const reportedBy = req.user._id;
      logger.info(`Received report for ${entityType} with ID: ${entityId} by user: ${reportedBy}`);
      const reportData = await this.reportsService.addReport(
        entityType,
        entityId,
        reportedBy,
        reportType,
        reportDescription
      );
      logger.info(`Report successfully added for ${entityType} with ID: ${entityId}`);
      res.status(StatusCode.OK).send(reportData);
    } catch (error:any) {
      logger.error(`Error in adding report for entity: ${req.params.entityType} with ID: ${req.params.entityId}. Error: ${error.message}`);
      next(error);
    }
  }
 

};


