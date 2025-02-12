import {
  IAdminService,
  IAdminRepository,
  IUserRepository,
} from "../types/types";

export default class AdminService implements IAdminService {
  private adminRepository: IAdminRepository;
  private userRepository: IUserRepository;
  constructor(
    adminRepository: IAdminRepository,
    userRepository: IUserRepository
  ) {
    this.adminRepository = adminRepository;
    this.userRepository = userRepository;
  }

  async verifyLogin(username: string, password: string): Promise<string> {
    try {
      return await this.adminRepository.verifyLogin(username, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async generateJWT(adminUsername: string): Promise<string> {
    try {
      return await this.adminRepository.generateJWT(adminUsername);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async dashboardCardData(): Promise<number[]> {
    try {
      return await this.adminRepository.dashboardCardData();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async dashboardChartData(): Promise<any> {
    try {
      const dates = [],
        todaysDate = new Date();
      const data = await this.adminRepository.dashboardChartData(todaysDate);

      for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const formattedDate = date.toISOString().split("T")[0];
        dates.push(formattedDate);
      }

      const responseFormat = dates.map((date) => {
        const count = data.find((val) => val._id === date)?.count || 0;
        return [date, count];
      });

      return [["Day", "Users"], ...responseFormat];
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async dashboardChartDataAccountType(): Promise<any> {
    try {
      const personalAccountCount =
        await this.adminRepository.personalAccountCount();
      const celebrityAccountCount =
        await this.adminRepository.celebrityAccountCount();
      const companyAccountCount =
        await this.adminRepository.companyAccountCount();

      const responseFormat = [
        ["Account Type", "Users count"],
        ["Personal Accounts", personalAccountCount],
        ["Celebrity Accounts", celebrityAccountCount],
        ["Company/Institution Accounts", companyAccountCount],
      ];
      return responseFormat;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getTickRequestsData(pageNo: number, rowsPerPage: number): Promise<any> {
    try {
      const skip = rowsPerPage * (pageNo - 1);
      const limit = rowsPerPage;

      const tickRequestData = await this.adminRepository.getTickRequestsData(
        skip,
        limit
      );

      const documentCount =
        await this.adminRepository.getTickRequestDocumentCount();

      const responseFormat = tickRequestData.map((data: any, index) => {
        const { imageUrl, description, status, createdAt, userId } = data;
        const requestId = data._id;
        const { username, firstName, lastName, profilePicUrl } = userId;

        return {
          sNo: skip + index + 1,
          requestId,
          userId: userId._id,
          username,
          firstName,
          lastName,
          profilePicUrl,
          imageUrl,
          description,
          status,
          createdAt,
        };
      });

      return [responseFormat, documentCount];
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changeTickRequestStatus(
    requestId: string,
    status: "approved" | "rejected",
    userId: string
  ) {
    try {
      const tickRequestData =
        await this.adminRepository.changeTickRequestStatus(requestId, status);
      console.log(tickRequestData);

      if (status === "approved")
        await this.adminRepository.giveTickToUser(userId);

      if (tickRequestData) {
        if (status === "approved") {
          try {
            await this.userRepository.sendRestrictNotificationToMQ(
              userId.toString(),
              userId.toString(),
              "approved",
              "Yay! Your request was accepted and you have approved with a WeNet-Tick !",
              "users",
              userId.toString()
            );
          } catch (error: any) {
            console.log(error.message);
          }
        }
        if (status === "rejected") {
          try {
            await this.userRepository.sendRestrictNotificationToMQ(
              userId.toString(),
              userId.toString(),
              "rejected",
              "Your request has been rejected since the proof was not enough!",
              "users",
              userId.toString()
            );
          } catch (error: any) {
            console.log(error.message);
          }
        }
      }

      return tickRequestData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
