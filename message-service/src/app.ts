import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import messageRouters from "./routes/messageRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import startConsumer from "./rabbitMQ/startConsumer";
import dotenv from "dotenv";
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}
import { Server } from "socket.io";
import { initializeSocketIO } from "./socket";
import ConnectDB from "./config/database";

const app = express();

const httpServer = http.createServer(app);

const frontEndUrl = process.env.FRONTEND_URL;
const corsOptions = {
  origin: frontEndUrl,
  credentials: true,
};

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: corsOptions,
});

app.set("io", io);
app.use(cors(corsOptions));
// app.use(cors())
// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(morgan("dev"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/message-service/", messageRouters);

initializeSocketIO(io);

app.use(errorHandler);

ConnectDB();
startConsumer();

const PORT = process.env.PORT || 5003;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
