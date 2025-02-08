"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = verifyUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const StatusCode_1 = require("../utils/StatusCode");
const constants_1 = require("../utils/constants");
function verifyUser(req, res, next) {
    var _a;
    const userToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!userToken) {
        res.status(StatusCode_1.StatusCode.UNAUTHORIZED).send(constants_1.MESSAGES.JWT_NOT_FOUND);
        return; // Ensure no further execution.
    }
    const secret = process.env.JWT_SECRET || "";
    if (!secret) {
        res
            .status(StatusCode_1.StatusCode.INTERNAL_SERVER_ERROR)
            .json(constants_1.MESSAGES.JWT_SECRET_NOT_FOUND);
        return; // Ensure no further execution.
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(userToken, secret);
        req.user = decoded.userData;
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.role) || decoded.role !== "wenet-user") {
            res.status(StatusCode_1.StatusCode.UNAUTHORIZED).send(constants_1.MESSAGES.INVALID_JWT);
            return; // Ensure no further execution.
        }
        next(); // Pass control to the next middleware.
    }
    catch (err) {
        res.status(StatusCode_1.StatusCode.UNAUTHORIZED).send(constants_1.MESSAGES.INVALID_JWT);
    }
}
