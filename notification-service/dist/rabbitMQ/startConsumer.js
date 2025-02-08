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
const amqplib_1 = __importDefault(require("amqplib"));
const consumer_1 = __importDefault(require("./consumer"));
const config_1 = require("./config");
const constants_1 = require("../utils/constants");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib_1.default.connect(constants_1.RABBITMQ_URL);
        const channel = yield connection.createChannel();
        const exchangeName = config_1.MQExchangeName;
        const consumers = config_1.notificationServiceConsumers;
        yield channel.assertExchange(exchangeName, "direct", { durable: true });
        consumers.forEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ queueName }) {
            return yield channel.assertQueue(queueName, {
                durable: true,
                exclusive: false,
            });
        }));
        consumers.forEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ queueName, routingKey }) { return yield channel.bindQueue(queueName, exchangeName, routingKey); }));
        // Set prefetch count
        const prefetchCount = 1;
        yield channel.prefetch(prefetchCount);
        consumers.forEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ queueName }) {
            yield (0, consumer_1.default)(channel, queueName);
            console.log(`Started consuming messages in ${queueName} queue`);
        }));
    }
    catch (error) {
        console.error("Error setting up consumer:", error);
    }
});
