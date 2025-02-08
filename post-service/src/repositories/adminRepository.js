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
const postCollection_1 = __importDefault(require("../models/postCollection"));
const constants_1 = require("../utils/constants");
class AdminRepository {
    getReportsData(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reportsData = yield reportsCollection_1.default
                    .find()
                    .skip(skip)
                    .limit(limit)
                    .populate("reportedBy") // Populate 'reportedBy' field with 'username' from 'users' collection
                    .populate("entityId") // Populate 'entityId' dynamically based on 'entityType'
                    .exec();
                console.log(reportsData);
                return reportsData;
            }
            catch (error) {
                throw new Error(constants_1.MESSAGES.ERROR_FETCHING_REPORTS);
            }
        });
    }
    resolveReport(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = (yield reportsCollection_1.default.findOne({
                    _id: new mongoose_1.Types.ObjectId(reportId),
                }));
                if (!report) {
                    throw new Error(constants_1.MESSAGES.ERROR_RESOLVING_REPORT);
                }
                report.isResolved = true;
                report === null || report === void 0 ? void 0 : report.save();
                return constants_1.MESSAGES.REPORT_RESOLVED_SUCCESS;
                ;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getDashboardCardData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalPosts = yield postCollection_1.default.countDocuments();
                const totalReports = yield reportsCollection_1.default.countDocuments();
                return [totalPosts, totalReports];
            }
            catch (error) {
                throw new Error(constants_1.MESSAGES.ERROR_FETCHING_DASHBOARD_DATA);
            }
        });
    }
    getReportsDocumentCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield reportsCollection_1.default.countDocuments();
            }
            catch (error) {
                throw new Error(constants_1.MESSAGES.ERROR_FETCHING_REPORT_COUNT);
            }
        });
    }
}
exports.default = AdminRepository;
