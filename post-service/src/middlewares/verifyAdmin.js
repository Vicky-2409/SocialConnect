"use strict";
// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = verifyAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../utils/constants");
const StatusCode_1 = require("../utils/StatusCode");
function verifyAdmin(req, res, next) {
    var _a;
    const adminToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.adminToken;
    if (!adminToken) {
        res.status(StatusCode_1.StatusCode.UNAUTHORIZED).send(constants_1.MESSAGES.ADMIN_JWT_NOT_FOUND);
        return;
    }
    const secret = process.env.JWT_SECRET || "";
    if (!secret) {
        res.status(StatusCode_1.StatusCode.INTERNAL_SERVER_ERROR).send(constants_1.MESSAGES.JWT_SECRET_NOT_FOUND);
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(adminToken, secret);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.role) || decoded.role !== "wenet-admin") {
            res.status(StatusCode_1.StatusCode.UNAUTHORIZED).send(constants_1.MESSAGES.INVALID_ADMIN_JWT);
            return;
        }
        next(); // Proceed to the next middleware
    }
    catch (err) {
        res.status(StatusCode_1.StatusCode.UNAUTHORIZED).send(constants_1.MESSAGES.INVALID_ADMIN_JWT);
    }
}
