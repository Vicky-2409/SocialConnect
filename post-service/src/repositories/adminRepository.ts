import { Types } from "mongoose";
import reportsCollection, { IReport } from "../models/reportsCollection";
import postsCollection from "../models/postCollection";
import { MESSAGES } from "../utils/constants";

export interface IAdminRepository {
  getReportsData(skip: number, limit: number): Promise<IReport[]>;
  resolveReport(reportId: string): Promise<string>;
  getDashboardCardData(): Promise<number[]>;
  getReportsDocumentCount(): Promise<number>;
}

export default class AdminRepository implements IAdminRepository {
  async getReportsData(skip: number, limit: number): Promise<IReport[]> {
    try {
      const reportsData: any = await reportsCollection
        .find()
        .skip(skip)
        .limit(limit)
        .populate("reportedBy") // Populate 'reportedBy' field with 'username' from 'users' collection
        .populate("entityId") // Populate 'entityId' dynamically based on 'entityType'
        .exec();
      console.log(reportsData);

      return reportsData;
    } catch (error: any) {
      throw new Error(MESSAGES.ERROR_FETCHING_REPORTS);
    }
  }

  async resolveReport(reportId: string): Promise<string> {
    try {
      const report = (await reportsCollection.findOne({
        _id: new Types.ObjectId(reportId),
      })) as IReport;
      if (!report) {
        throw new Error(MESSAGES.ERROR_RESOLVING_REPORT);
      }

      report.isResolved = true;
      report?.save();

      return MESSAGES.REPORT_RESOLVED_SUCCESS;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getDashboardCardData(): Promise<number[]> {
    try {
      const totalPosts = await postsCollection.countDocuments();
      const totalReports = await reportsCollection.countDocuments();
      return [totalPosts, totalReports];
    } catch (error: any) {
      throw new Error(MESSAGES.ERROR_FETCHING_DASHBOARD_DATA);
    }
  }

  async getReportsDocumentCount() {
    try {
      return await reportsCollection.countDocuments();
    } catch (error: any) {
      throw new Error(MESSAGES.ERROR_FETCHING_REPORT_COUNT);
    }
  }
}
