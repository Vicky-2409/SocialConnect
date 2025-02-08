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
const messageHandler_1 = require("./messageHandler");
const consumeMessages = (channel, queue) => __awaiter(void 0, void 0, void 0, function* () {
    const onMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!message)
            return;
        console.log("Message received:", message.content.toString());
        try {
            const { correlationId, replyTo } = message.properties;
            const operation = (_a = message.properties.headers) === null || _a === void 0 ? void 0 : _a.function;
            if (!operation) {
                console.error("Message is missing required properties.");
                channel.nack(message, false, false);
                return;
            }
            const data = JSON.parse(message.content.toString());
            console.log(`Handling message with operation: ${operation}`);
            try {
                yield messageHandler_1.MessageHandler.handle(operation, data, correlationId, replyTo, channel);
            }
            catch (error) {
                throw new Error(error.message);
            }
            channel.ack(message);
            console.log("Message acknowledged.");
        }
        catch (error) {
            console.error("Error processing message:", error);
            channel.nack(message, false, false);
        }
    });
    channel.consume(queue, onMessage, { noAck: false });
});
exports.default = consumeMessages;
