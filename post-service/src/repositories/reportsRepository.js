"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reportsCollection_1 = __importDefault(require("../models/reportsCollection"));
const userCollection_1 = __importDefault(require("../models/userCollection"));
const postCollection_1 = __importDefault(require("../models/postCollection"));
const commentCollection_1 = __importDefault(require("../models/commentCollection"));
class ReportsRepository {
    addReport(entityType, entityId, reportedBy, reportType, reportDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reportData = {
                    entityType,
                    entityId: new mongoose_1.Types.ObjectId(entityId),
                    reportedBy: new mongoose_1.Types.ObjectId(reportedBy),
                    reportType,
                    reportDescription,
                };
                const report = yield reportsCollection_1.default.create(reportData);
                //add the report information to the reporting user's document
                yield userCollection_1.default.updateOne({ _id: new mongoose_1.Types.ObjectId(reportedBy) }, { $addToSet: { reported: report._id } });
                //add the report information to the reported entity's document
                let reportedEntityData;
                if (entityType === "posts") {
                    reportedEntityData = yield postCollection_1.default.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(entityId) }, { $addToSet: { reports: report._id } }, { new: true });
                }
                else if (entityType === "comments") {
                    reportedEntityData = yield commentCollection_1.default.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(entityId) }, { $addToSet: { reports: report._id } }, { new: true });
                }
                //add the report information to the reported user's document
                const reportedUserId = (reportedEntityData === null || reportedEntityData === void 0 ? void 0 : reportedEntityData.userId) || entityId;
                yield userCollection_1.default.updateOne({ _id: new mongoose_1.Types.ObjectId(reportedUserId) }, { $addToSet: { reportsReceived: report._id } });
                return report;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = ReportsRepository;
