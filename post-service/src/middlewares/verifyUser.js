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
exports.verifyUser = verifyUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userCollection_1 = __importDefault(require("../models/userCollection"));
const StatusCode_1 = require("../utils/StatusCode");
const constants_1 = require("../utils/constants");
function verifyUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const userToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
            if (!userToken) {
                res.status(StatusCode_1.StatusCode.UNAUTHORIZED).json({ message: constants_1.MESSAGES.JWT_NOT_FOUND });
                return; // Stop further execution.
            }
            const secret = process.env.JWT_SECRET || "";
            if (!secret) {
                res.status(StatusCode_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: constants_1.MESSAGES.JWT_SECRET_NOT_FOUND });
                return; // Stop further execution.
            }
            const decoded = jsonwebtoken_1.default.verify(userToken, secret);
            req.user = decoded.userData;
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.role) || decoded.role !== "wenet-user") {
                res.status(StatusCode_1.StatusCode.UNAUTHORIZED).json({ message: constants_1.MESSAGES.INVALID_JWT_ROLE });
                return; // Stop further execution.
            }
            // Check if the user exists and is not restricted
            const user = yield userCollection_1.default.findOne({ username: (_b = decoded.userData) === null || _b === void 0 ? void 0 : _b.username });
            if (!user || user.isRestricted) {
                const message = !user
                    ? constants_1.MESSAGES.USER_NOT_FOUND
                    : constants_1.MESSAGES.USER_RESTRICTED;
                res.status(StatusCode_1.StatusCode.UNAUTHORIZED).json({ message });
                return; // Stop further execution.
            }
            next(); // Pass control to the next middleware.
        }
        catch (err) {
            console.error("Error during user verification:", err.message);
            res.status(StatusCode_1.StatusCode.UNAUTHORIZED).json({ message: constants_1.MESSAGES.INVALID_JWT });
            return; // Stop further execution.
        }
    });
}
