"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const startConsumer_1 = __importDefault(require("./rabbitMQ/startConsumer"));
const database_1 = require("./config/database");
const socket_io_1 = require("socket.io");
const socket_1 = require("./socket");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, database_1.connectDB)();
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
// /* 
const frontEndUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const corsOptions = {
    origin: frontEndUrl,
    credentials: true,
};
const io = new socket_io_1.Server(httpServer, {
    pingTimeout: 60000,
    cors: corsOptions,
});
app.set("io", io);
app.use((0, cors_1.default)(corsOptions));
// Handle preflight requests
app.options("*", (0, cors_1.default)(corsOptions));
// */ 
/*test:
app.use(cors())
*/
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/api/notification-service/", notificationRoutes_1.default);
(0, socket_1.initializeSocketIO)(io);
app.use(errorHandler_1.errorHandler);
(0, startConsumer_1.default)();
const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
    console.log(`Notification Service is running on port ${PORT}`);
});
