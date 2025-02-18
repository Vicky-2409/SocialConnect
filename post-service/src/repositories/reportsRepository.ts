// import { Types } from "mongoose";
// import reportsCollection, { IReport } from "../models/reportsCollection";
// import userCollection from "../models/userCollection";
// import postsCollection from "../models/postCollection";
// import commentCollection from "../models/commentCollection";

// export interface IReportsRepository {
//   addReport(
//     entityType: "posts" | "comments" | "users", // Restrict to specific entity types
//     entityId: string, // Entity ID (e.g., post, comment, user)
//     reportedBy: string, // The user who reported the entity
//     reportType: string, // The type/category of the report
//     reportDescription: string // The description or reason for the report
//   ): Promise<IReport>; // The method returns a Promise that resolves to an IReport
// }

// export default class ReportsRepository {
//   async addReport(
//     entityType: "posts" | "comments" | "users",
//     entityId: string,
//     reportedBy: string,
//     reportType: string,
//     reportDescription: string
//   ): Promise<IReport> {
//     try {
//       const reportData = {
//         entityType,
//         entityId: new Types.ObjectId(entityId),
//         reportedBy: new Types.ObjectId(reportedBy),
//         reportType,
//         reportDescription,
//       };

//       const report = await reportsCollection.create(reportData);

//       //add the report information to the reporting user's document
//       await userCollection.updateOne(
//         { _id: new Types.ObjectId(reportedBy) },
//         { $addToSet: { reported: report._id } }
//       );

//       //add the report information to the reported entity's document
//       let reportedEntityData: any;
//       if (entityType === "posts") {
//         reportedEntityData = await postsCollection.findOneAndUpdate(
//           { _id: new Types.ObjectId(entityId) },
//           { $addToSet: { reports: report._id } },
//           { new: true }
//         );
//       } else if (entityType === "comments") {
//         reportedEntityData = await commentCollection.findOneAndUpdate(
//           { _id: new Types.ObjectId(entityId) },
//           { $addToSet: { reports: report._id } },
//           { new: true }
//         );
//       }

//       //add the report information to the reported user's document

//       const reportedUserId: string | Types.ObjectId =
//         reportedEntityData?.userId || entityId;

//       await userCollection.updateOne(
//         { _id: new Types.ObjectId(reportedUserId) },
//         { $addToSet: { reportsReceived: report._id } }
//       );

//       return report;
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }
// }


























import { Types } from "mongoose";
import { BaseRepository, IBaseRepository } from "./baseRepository";
import reportsCollection, { IReport } from "../models/reportsCollection";
import userCollection from "../models/userCollection";
import postsCollection from "../models/postCollection";
import commentCollection from "../models/commentCollection";
import logger from "../utils/logger";

export interface IReportsRepository extends IBaseRepository<IReport> {
  addReport(
    entityType: "posts" | "comments" | "users",
    entityId: string,
    reportedBy: string,
    reportType: string,
    reportDescription: string
  ): Promise<IReport>;
}

export class ReportsRepository extends BaseRepository<IReport> implements IReportsRepository {
  constructor() {
    super(reportsCollection);
  }

  async addReport(
    entityType: "posts" | "comments" | "users",
    entityId: string,
    reportedBy: string,
    reportType: string,
    reportDescription: string
  ): Promise<IReport> {
    try {
      // Create the report using the base repository's create method
      const report = await this.create({
        entityType,
        entityId: new Types.ObjectId(entityId),
        reportedBy: new Types.ObjectId(reportedBy),
        reportType,
        reportDescription,
      });

      // Update the reporting user's document
      await userCollection.updateOne(
        { _id: new Types.ObjectId(reportedBy) },
        { $addToSet: { reported: report._id } }
      );

      // Update the reported entity's document
      let reportedEntityData: any;
      switch (entityType) {
        case "posts":
          reportedEntityData = await postsCollection.findOneAndUpdate(
            { _id: new Types.ObjectId(entityId) },
            { $addToSet: { reports: report._id } },
            { new: true }
          );
          break;
        case "comments":
          reportedEntityData = await commentCollection.findOneAndUpdate(
            { _id: new Types.ObjectId(entityId) },
            { $addToSet: { reports: report._id } },
            { new: true }
          );
          break;
      }

      // Update the reported user's document
      const reportedUserId = reportedEntityData?.userId || entityId;
      await userCollection.updateOne(
        { _id: new Types.ObjectId(reportedUserId) },
        { $addToSet: { reportsReceived: report._id } }
      );

      return report;
    } catch (error: any) {
      logger.error("AddReport error:", error);
      throw new Error(error.message);
    }
  }
}