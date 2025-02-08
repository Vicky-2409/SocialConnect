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
exports.publisher = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const config_1 = require("./config");
const constants_1 = require("../utils/constants");
exports.publisher = {
    connectRabbitMQ: function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Establish connection to RabbitMQ
                const connection = yield amqplib_1.default.connect(constants_1.RABBITMQ_URL);
                const channel = yield connection.createChannel();
                return [channel, connection];
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    },
    disconnectRabbitMQ: function (channel, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Close connection
                yield channel.close();
                yield connection.close();
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    },
    publishNotificationToMessageService: function (notificationData, action) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [channel, connection] = yield this.connectRabbitMQ();
                const exchangeName = config_1.MQExchangeName;
                const routingKey = config_1.notificationServiceProducers[0]; // Specific routing key
                yield channel.assertExchange(exchangeName, "direct", { durable: true });
                const messageProperties = {
                    headers: {
                        function: action,
                    },
                };
                const message = JSON.stringify(notificationData);
                channel.publish(exchangeName, routingKey, Buffer.from(message), messageProperties);
                console.log("Message published to RabbitMQ:", notificationData);
                yield this.disconnectRabbitMQ(channel, connection);
            }
            catch (error) {
                console.error("Error publishing message to RabbitMQ:", error);
                throw new Error(error.message);
            }
        });
    },
};
