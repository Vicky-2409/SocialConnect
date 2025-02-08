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
exports.MessageHandler = void 0;
const config_1 = require("./config");
const injection_1 = require("../routes/injection");
exports.MessageHandler = {
    handle: function (operation, data, correlationId, replyTo, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                switch (operation) {
                    case `${config_1.MQActions.addUser}`: {
                        response = yield createUser(data);
                        break;
                    }
                    case `${config_1.MQActions.editUser}`: {
                        response = yield updateUser(data);
                        break;
                    }
                    case `${config_1.MQActions.addWeNetAd}`: {
                        response = yield createWeNetAd(data);
                        break;
                    }
                    default:
                        throw new Error(`Unknown operation: ${operation}`);
                }
                // Send response back to the replyTo queue
                // const responseBuffer = Buffer.from(JSON.stringify(response));
                // channel.sendToQueue(replyTo, responseBuffer, { correlationId });
            }
            catch (error) {
                console.error("Error handling message:", error);
                // Send error response back to the replyTo queue
                // const errorBuffer = Buffer.from(JSON.stringify({ error: error.message }));
                // channel.sendToQueue(replyTo, errorBuffer, { correlationId });
            }
        });
    },
};
// Operations
function createUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield injection_1.userService.addUser(data);
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
}
function updateUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield injection_1.userService.updateUser(data);
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
}
function createWeNetAd(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { postId, WeNetAds } = data;
            const message = yield injection_1.postsServices.createWeNetAd(postId, WeNetAds);
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
}
