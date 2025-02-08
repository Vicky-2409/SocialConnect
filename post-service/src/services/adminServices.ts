import { IReport } from "../models/reportsCollection";
import { IAdminRepository } from "../repositories/adminRepository";

export interface IAdminService {
  getReportsData(
    pageNo: number,
    rowsPerPage: number
  ): Promise<[IReport[], number]>; // Method to fetch reports data with pagination

  resolveReport(reportId: string): Promise<string>; // Method to resolve a report by ID, returns a success message

  getDashboardCardData(): Promise<number[]>; // Method to get dashboard card data (e.g., total posts, total reports)
}

export default class AdminService implements IAdminService {
  private adminRepository: IAdminRepository;
  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository;
  }
  async getReportsData(
    pageNo: number,
    rowsPerPage: number
  ): Promise<[IReport[], number]> {
    try {
      const skip = rowsPerPage * (pageNo - 1);
      const limit = rowsPerPage;
      const reportsData = await this.adminRepository.getReportsData(
        skip,
        limit
      );
      const documentCount =
        await this.adminRepository.getReportsDocumentCount();

      return [reportsData, documentCount];
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async resolveReport(reportId: string): Promise<string> {
    try {
      return await this.adminRepository.resolveReport(reportId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getDashboardCardData(): Promise<number[]> {
    try {
      const [totalPosts, totalReports] =
        await this.adminRepository.getDashboardCardData();
      return [totalPosts, totalReports];
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
