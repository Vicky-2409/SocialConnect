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
exports.emitNotification = exports.initializeSocketIO = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userCollection_1 = __importDefault(require("../models/userCollection"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}
// Store connected users in a map to emit to specific users
const userSockets = {};
const initializeSocketIO = (io) => {
    io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = socket.handshake.auth.token;
        if (token) {
            jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                if (err) {
                    return next(new Error("Authentication error"));
                }
                socket.data.user = decoded; // Store the user data on the socket
                try {
                    const user = yield userCollection_1.default.findById((_a = decoded === null || decoded === void 0 ? void 0 : decoded.userData) === null || _a === void 0 ? void 0 : _a._id);
                    if (!user) {
                        return next(new Error("User not found"));
                    }
                    socket.user = user; // Attach user to socket
                    userSockets[user._id.toString()] = socket; // Store the socket per user
                    next();
                }
                catch (err) {
                    next(new Error("Error fetching user from the database"));
                }
            }));
        }
        else {
            next(new Error("Authentication error"));
        }
    }));
    io.on("connection", (socket) => {
        console.log("A user connected: " + socket.user._id);
        const userId = socket.user._id;
        console.log('Emitting connected event with userId:', userId);
        // Emit both standard and custom events
        socket.emit("user-connected", {
            userId: userId.toString() // Convert ObjectId to string
        });
        socket.emit("connected", { userId }); // Custom event
        // Listen for test event
        socket.on("test-connection", (data) => {
            console.log('Test connection received:', data);
        });
        // Handle socket events after authentication
        socket.on("message", (data) => {
            console.log("Message received:", data);
            socket.emit("message-response", "Message received on the server");
        });
        socket.on("disconnect", () => {
            var _a;
            console.log("A user disconnected: " + socket.id);
            // Remove the socket when user disconnects
            const userId = (_a = socket.user) === null || _a === void 0 ? void 0 : _a._id.toString();
            if (userId) {
                delete userSockets[userId];
            }
        });
    });
};
exports.initializeSocketIO = initializeSocketIO;
// Function to emit notifications
const emitNotification = (notification) => {
    const userSocket = userSockets[String(notification.userId)];
    if (userSocket) {
        userSocket.emit("new-notification", notification); // Emit the notification to the specific user
        console.log(`emitting new-notification event////////////////////////// with ${notification}`);
    }
};
exports.emitNotification = emitNotification;
