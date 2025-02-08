"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const startConsumer_1 = __importDefault(require("./rabbitMq/startConsumer"));
const postsRoutes_1 = __importDefault(require("./routes/postsRoutes"));
const commentsRoutes_1 = __importDefault(require("./routes/commentsRoutes"));
const reportsRoutes_1 = __importDefault(require("./routes/reportsRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = require("./middlewares/errorHandler");
const database_1 = require("./config/database");
dotenv_1.default.config();
const app = (0, express_1.default)();
// /* 
const frontEndUrl = process.env.FRONTEND_URL;
const corsOptions = {
    origin: frontEndUrl,
    credentials: true,
};
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
app.use("/api/posts-service/comment", commentsRoutes_1.default);
app.use("/api/posts-service/report", reportsRoutes_1.default);
app.use("/api/posts-service/admin", adminRoutes_1.default);
app.use("/api/posts-service/", postsRoutes_1.default);
app.use(errorHandler_1.errorHandler);
(0, startConsumer_1.default)();
(0, database_1.connectDB)();
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Post Service is running on port ${PORT}`);
});
