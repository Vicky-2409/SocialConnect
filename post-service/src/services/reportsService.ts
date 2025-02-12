import { IReport } from "../models/reportsCollection";
import { IReportsRepository } from "../repositories/reportsRepository";

export interface IReportsService {
  addReport(
    entityType: "posts" | "comments" | "users",
    entityId: string,
    reportedBy: string,
    reportType: string,
    reportDescription: string
  ): Promise<IReport>; // Add a report
}

export default class ReportsService implements IReportsService {
  private reportsRepository: IReportsRepository;

  constructor(reportsRepository: IReportsRepository) {
    this.reportsRepository = reportsRepository;
  }
  async addReport(
    entityType: "posts" | "comments" | "users",
    entityId: string,
    reportedBy: string,
    reportType: string,
    reportDescription: string
  ): Promise<IReport> {
    try {
      return await this.reportsRepository.addReport(
        entityType,
        entityId,
        reportedBy,
        reportType,
        reportDescription
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
