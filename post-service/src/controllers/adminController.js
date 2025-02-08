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
const StatusCode_1 = require("../utils/StatusCode");
const logger_1 = __importDefault(require("../utils/logger"));
class AdminController {
    constructor(adminServices) {
        this.adminServices = adminServices;
    }
    getReportsData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("Entering getReportsData method");
            try {
                const { pageNo, rowsPerPage } = req.query;
                logger_1.default.debug(`Received query params - pageNo: ${pageNo}, rowsPerPage: ${rowsPerPage}`);
                const reportsData = yield this.adminServices.getReportsData(Number(pageNo), Number(rowsPerPage));
                logger_1.default.info("Successfully retrieved reports data");
                res.status(StatusCode_1.StatusCode.OK).send(reportsData);
            }
            catch (error) {
                logger_1.default.error(`Error in getReportsData: ${error.message}`, { error });
                next(error);
            }
        });
    }
    resolveReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reportId } = req.params;
                logger_1.default.debug(`Received reportId: ${reportId}`);
                const message = yield this.adminServices.resolveReport(reportId);
                logger_1.default.info("Successfully resolved report");
                res.status(StatusCode_1.StatusCode.OK).send({ message });
            }
            catch (error) {
                logger_1.default.error(`Error in resolveReport: ${error.message}`, { error });
                next(error);
            }
        });
    }
    getDashboardCardData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("Entering getDashboardCardData method");
            try {
                const [totalPosts, totalReports] = yield this.adminServices.getDashboardCardData();
                logger_1.default.info("Successfully retrieved dashboard card data");
                res.status(StatusCode_1.StatusCode.OK).send([totalPosts, totalReports]);
            }
            catch (error) {
                logger_1.default.error(`Error in getDashboardCardData: ${error.message}`, { error });
                next(error);
            }
        });
    }
}
exports.default = AdminController;
