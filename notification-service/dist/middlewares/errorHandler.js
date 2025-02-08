"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const constants_1 = require("../utils/constants");
const StatusCode_1 = require("../utils/StatusCode");
const errorHandler = (error, req, res, next) => {
    let errorMsg = error.message || constants_1.MESSAGES.UNEXPECTED_ERROR;
    console.log(errorMsg);
    res.status(StatusCode_1.StatusCode.INTERNAL_SERVER_ERROR).send(errorMsg);
};
exports.errorHandler = errorHandler;
