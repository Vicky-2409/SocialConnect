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
Object.defineProperty(exports, "__esModule", { value: true });
class AdminService {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    getReportsData(pageNo, rowsPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = rowsPerPage * (pageNo - 1);
                const limit = rowsPerPage;
                const reportsData = yield this.adminRepository.getReportsData(skip, limit);
                const documentCount = yield this.adminRepository.getReportsDocumentCount();
                return [reportsData, documentCount];
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    resolveReport(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.resolveReport(reportId);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getDashboardCardData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [totalPosts, totalReports] = yield this.adminRepository.getDashboardCardData();
                return [totalPosts, totalReports];
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = AdminService;
