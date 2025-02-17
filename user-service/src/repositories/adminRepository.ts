// import jwt from "jsonwebtoken";
// import userCollection from "../models/User";
// import wenetTickRequestCollection from "../models/WenetTickRequest";
// import { IAdminRepository } from "../types/types";
// import {
//   EnvErrorMsg,
//   GeneralErrorMsg,
//   JwtErrorMsg,
//   Role,
//   TickRequestStatus,
//   UserErrorMsg,
// } from "../utils/constants";

// export default class AdminRepository implements IAdminRepository {
//   async verifyLogin(username: string, password: string): Promise<string> {
//     try {
//       const adminUsername = process.env.ADMIN_USERNAME;
//       const adminPassword = process.env.ADMIN_PASSWORD;

//       if (!adminUsername || !adminPassword)
//         throw new Error(EnvErrorMsg.ADMIN_NOT_FOUND);

//       const isMatching =
//         username === adminUsername && password === adminPassword;
//       if (!isMatching) throw new Error("Credentials doesn't match");
//       return adminUsername;
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }

//   async generateJWT(adminUsername: string): Promise<string> {
//     try {
//       const secret: string | undefined = process.env.JWT_SECRET;
//       if (!secret) throw new Error(EnvErrorMsg.JWT_NOT_FOUND);
//       return jwt.sign({ adminUsername, role: Role.Admin }, secret, {
//         expiresIn: JwtErrorMsg.JWT_EXPIRATION,
//       });
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }

//   async dashboardCardData(): Promise<number[]> {
//     try {
//       const totalUsers = await userCollection.countDocuments();
//       const totalVerifiedAccounts = await userCollection.countDocuments({
//         "accountType.hasWeNetTick": true,
//       });
//       return [totalUsers, totalVerifiedAccounts];
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }

//   async dashboardChartData(startDate: Date) {
//     try {
//       startDate.setDate(startDate.getDate() - 14);
//       startDate.setHours(0, 0, 0, 0);

//       return await userCollection.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: startDate },
//           },
//         },
//         {
//           $group: {
//             _id: {
//               $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
//             },
//             count: { $sum: 1 },
//           },
//         },
//         {
//           $sort: { _id: 1 },
//         },
//       ]);
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }

//   async personalAccountCount() {
//     try {
//       return await userCollection.countDocuments({
//         "accountType.isProfessional": false,
//       });
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }

//   async celebrityAccountCount() {
//     try {
//       return await userCollection.countDocuments({
//         "accountType.category": "celebrity",
//       });
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }

//   async companyAccountCount() {
//     try {
//       return await userCollection.countDocuments({
//         "accountType.category": "company",
//       });
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }

//   async getTickRequestsData(skip: number, limit: number) {
//     try {
//       const response = await wenetTickRequestCollection
//         .find()
//         .skip(skip)
//         .limit(limit)
//         .populate("userId");
//       return response;
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }

//   async getTickRequestDocumentCount() {
//     try {
//       return await wenetTickRequestCollection.countDocuments();
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }

//   async changeTickRequestStatus(requestId: string, status: TickRequestStatus) {
//     try {
//       const tickRequestData = await wenetTickRequestCollection.findById(
//         requestId
//       );
//       if (!tickRequestData)
//         throw new Error(GeneralErrorMsg.TICK_REQUEST_NOT_FOUND);

//       tickRequestData.status = status;
//       await tickRequestData.save();

//       return tickRequestData;
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }

//   async giveTickToUser(userId: string) {
//     try {
//       const updatedUser = await userCollection.findByIdAndUpdate(
//         userId,
//         { $set: { "accountType.hasWeNetTick": true } },
//         { new: true, runValidators: true }
//       );

//       if (!updatedUser) throw new Error(UserErrorMsg.NO_USER);

//       return updatedUser;
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }
// }

// import jwt from "jsonwebtoken";
// import { Document, Types } from "mongoose";
// import userCollection, { IUser } from "../models/User";
// import wenetTickRequestCollection, { IWenetTickRequest } from "../models/WenetTickRequest";
// import { IAdminRepository } from "../types/types";
// import { BaseRepository } from "./baseRepository";
// import {
//   EnvErrorMsg,
//   GeneralErrorMsg,
//   JwtErrorMsg,
//   Role,
//   TickRequestStatus,
//   UserErrorMsg,
// } from "../utils/constants";

// export default class AdminRepository extends BaseRepository<IUser> implements IAdminRepository {
//   private tickRequestRepository: BaseRepository<IWenetTickRequest>;

//   constructor() {
//     super(userCollection);
//     this.tickRequestRepository = new BaseRepository(wenetTickRequestCollection);
//   }

//   async verifyLogin(username: string, password: string): Promise<string> {
//     const adminUsername = process.env.ADMIN_USERNAME;
//     const adminPassword = process.env.ADMIN_PASSWORD;

//     if (!adminUsername || !adminPassword) {
//       throw new Error(EnvErrorMsg.ADMIN_NOT_FOUND);
//     }

//     const isMatching = username === adminUsername && password === adminPassword;
//     if (!isMatching) {
//       throw new Error("Credentials doesn't match");
//     }
//     return adminUsername;
//   }

//   async generateJWT(adminUsername: string): Promise<string> {
//     const secret: string | undefined = process.env.JWT_SECRET;
//     if (!secret) {
//       throw new Error(EnvErrorMsg.JWT_NOT_FOUND);
//     }
//     return jwt.sign({ adminUsername, role: Role.Admin }, secret, {
//       expiresIn: JwtErrorMsg.JWT_EXPIRATION,
//     });
//   }

//   async dashboardCardData(): Promise<number[]> {
//     const [totalUsers, totalVerifiedAccounts] = await Promise.all([
//       this.count(),
//       this.count({ "accountType.hasWeNetTick": true })
//     ]);
//     return [totalUsers, totalVerifiedAccounts];
//   }

//   async dashboardChartData(startDate: Date) {
//     startDate.setDate(startDate.getDate() - 14);
//     startDate.setHours(0, 0, 0, 0);

//     return this.model.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startDate },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
//           },
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $sort: { _id: 1 },
//       },
//     ]);
//   }

//   async personalAccountCount(): Promise<number> {
//     return this.count({ "accountType.isProfessional": false });
//   }

//   async celebrityAccountCount(): Promise<number> {
//     return this.count({ "accountType.category": "celebrity" });
//   }

//   async companyAccountCount(): Promise<number> {
//     return this.count({ "accountType.category": "company" });
//   }

//   async getTickRequestsData(skip: number, limit: number) {
//     return this.tickRequestRepository.model
//       .find()
//       .skip(skip)
//       .limit(limit)
//       .populate("userId");
//   }

//   async getTickRequestDocumentCount(): Promise<number> {
//     return this.tickRequestRepository.count();
//   }

//   async changeTickRequestStatus(requestId: string, status: TickRequestStatus) {
//     const tickRequestData = await this.tickRequestRepository.findById(requestId);

//     if (!tickRequestData) {
//       throw new Error(GeneralErrorMsg.TICK_REQUEST_NOT_FOUND);
//     }

//     tickRequestData.status = status;
//     return tickRequestData.save();
//   }

//   async giveTickToUser(userId: string) {
//     const updatedUser = await this.update(
//       userId,
//       { $set: { "accountType.hasWeNetTick": true } }
//     );

//     if (!updatedUser) {
//       throw new Error(UserErrorMsg.NO_USER);
//     }

//     return updatedUser;
//   }
// }

// First, let's create a concrete repository for WenetTickRequest








import { Document, Model, Types } from "mongoose";
import userCollection, { IUser } from "../models/User";
import wenetTickRequestCollection, {
  IWenetTickRequest,
} from "../models/WenetTickRequest";
import { IAdminRepository } from "../types/types";
import { BaseRepository } from "./baseRepository";
import jwt from "jsonwebtoken";
import {
  EnvErrorMsg,
  GeneralErrorMsg,
  JwtErrorMsg,
  Role,
  TickRequestStatus,
  UserErrorMsg,
} from "../utils/constants";

// Create concrete repository for WenetTickRequest
class TickRequestRepository extends BaseRepository<IWenetTickRequest> {
  constructor() {
    super(wenetTickRequestCollection);
  }

  async findWithUserData(skip: number, limit: number) {
    return this.model.find().skip(skip).limit(limit).populate("userId");
  }
}

// Refactored AdminRepository
export default class AdminRepository
  extends BaseRepository<IUser>
  implements IAdminRepository
{
  private tickRequestRepository: TickRequestRepository;

  constructor() {
    super(userCollection);
    this.tickRequestRepository = new TickRequestRepository();
  }

  async verifyLogin(username: string, password: string): Promise<string> {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      throw new Error(EnvErrorMsg.ADMIN_NOT_FOUND);
    }

    const isMatching = username === adminUsername && password === adminPassword;
    if (!isMatching) {
      throw new Error("Credentials doesn't match");
    }
    return adminUsername;
  }

  async generateJWT(adminUsername: string): Promise<string> {
    const secret: string | undefined = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error(EnvErrorMsg.JWT_NOT_FOUND);
    }
    return jwt.sign({ adminUsername, role: Role.Admin }, secret, {
      expiresIn: JwtErrorMsg.JWT_EXPIRATION,
    });
  }

  async dashboardCardData(): Promise<number[]> {
    const [totalUsers, totalVerifiedAccounts] = await Promise.all([
      this.count(),
      this.count({ "accountType.hasWeNetTick": true }),
    ]);
    return [totalUsers, totalVerifiedAccounts];
  }

  async dashboardChartData(startDate: Date) {
    startDate.setDate(startDate.getDate() - 14);
    startDate.setHours(0, 0, 0, 0);

    return this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }

  async personalAccountCount(): Promise<number> {
    return this.count({ "accountType.isProfessional": false });
  }

  async celebrityAccountCount(): Promise<number> {
    return this.count({ "accountType.category": "celebrity" });
  }

  async companyAccountCount(): Promise<number> {
    return this.count({ "accountType.category": "company" });
  }

  async getTickRequestsData(skip: number, limit: number) {
    return this.tickRequestRepository.findWithUserData(skip, limit);
  }

  async getTickRequestDocumentCount(): Promise<number> {
    return this.tickRequestRepository.count();
  }

  async changeTickRequestStatus(requestId: string, status: TickRequestStatus) {
    const tickRequestData = await this.tickRequestRepository.findById(
      requestId
    );

    if (!tickRequestData) {
      throw new Error(GeneralErrorMsg.TICK_REQUEST_NOT_FOUND);
    }

    tickRequestData.status = status;
    return tickRequestData.save();
  }

  async giveTickToUser(userId: string) {
    const updatedUser = await this.update(userId, {
      $set: { "accountType.hasWeNetTick": true },
    });

    if (!updatedUser) {
      throw new Error(UserErrorMsg.NO_USER);
    }

    return updatedUser;
  }
}
