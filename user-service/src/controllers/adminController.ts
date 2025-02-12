import { NextFunction, Request, Response } from "express";
import userCollection from "../models/User";
import {
  GeneralErrorMsg,
  ResponseMsg,
  TickRequestStatus,
} from "../utils/constants";
import { IAdminController, IAdminService } from "../types/types";
import { StatusCode } from "../utils/enum";
import logger from "../utils/logger";

export default class AdminController implements IAdminController {
  private adminService: IAdminService;
  constructor(adminService: IAdminService) {
    this.adminService = adminService;
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;
      logger.info("Admin login attempt", { username });

      const adminUsername = await this.adminService.verifyLogin(
        username,
        password
      );

      const adminToken = await this.adminService.generateJWT(adminUsername);
      res.cookie("adminToken", adminToken);
      logger.info("Admin logged in successfully", { username });
      res.status(StatusCode.OK).send(ResponseMsg.ADMIN_LOGGED_IN);
    } catch (error: any) {
      logger.error("Error during admin login", { error: error.message });
      next(error);
    }
  }

  async userManagement(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info("Fetching all user data");
      const userData = await userCollection.find();
      logger.info("User data fetched successfully");
      res.status(StatusCode.OK).json(userData);
    } catch (error: any) {
      logger.error("Error fetching user data", { error: error.message });
      next(error);
    }
  }

  async dashboardCardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info("Fetching dashboard card data");
      const [totalUsers, totalVerifiedAccounts] =
        await this.adminService.dashboardCardData();
      logger.info(
        "Dashboard card data fetched successfully",
        totalUsers,
        totalVerifiedAccounts
      );
      res.status(StatusCode.OK).send([totalUsers, totalVerifiedAccounts]);
    } catch (error: any) {
      logger.error("Error fetching dashboard card data", {
        error: error.message,
      });
      next(error);
    }
  }

  async dashboardChartData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info("Fetching dashboard chart data");
      const data = await this.adminService.dashboardChartData();
      logger.info("Dashboard chart data fetched successfully");
      res.status(200).send(data);
    } catch (error: any) {
      logger.error("Error fetching dashboard chart data", {
        error: error.message,
      });
      next(error);
    }
  }

  async dashboardChartDataAccountType(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info("Fetching dashboard chart data by account type");
      const data = await this.adminService.dashboardChartDataAccountType();
      logger.info("Dashboard chart data by account type fetched successfully");
      res.status(200).send(data);
    } catch (error: any) {
      logger.error("Error fetching dashboard chart data by account type", {
        error: error.message,
      });
      next(error);
    }
  }

  async getTickRequestsData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { pageNo, rowsPerPage } = req.query;
      logger.info("Fetching tick requests data", { pageNo, rowsPerPage });
      const data = await this.adminService.getTickRequestsData(
        Number(pageNo),
        Number(rowsPerPage)
      );
      logger.info("Tick requests data fetched successfully");
      res.status(200).send(data);
    } catch (error: any) {
      logger.error("Error fetching tick requests data", {
        error: error.message,
      });
      next(error);
    }
  }

  async changeTickRequestStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { requestId } = req.params;
      const { status, userId } = req.body;
      logger.info("Changing tick request status", {
        requestId,
        status,
        userId,
      });

      if (
        status != TickRequestStatus.APPROVED &&
        status != TickRequestStatus.REJECTED
      )
        throw new Error(GeneralErrorMsg.INVALID_TICK_REQUEST);

      const data = await this.adminService.changeTickRequestStatus(
        requestId,
        status,
        userId
      );
      logger.info("Tick request status changed successfully", { requestId });
      res.status(200).send(data);
    } catch (error: any) {
      logger.error("Error changing tick request status", {
        error: error.message,
      });
      next(error);
    }
  }
}
