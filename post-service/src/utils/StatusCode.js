"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
