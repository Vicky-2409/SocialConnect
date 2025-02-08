import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import notificationRoutes from './routes/notificationRoutes'
import { errorHandler } from "./middlewares/errorHandler";
import startConsumer from "./rabbitMQ/startConsumer";
import { connectDB } from "./config/database";
import { Server } from "socket.io";
import { initializeSocketIO } from "./socket";

import dotenv from "dotenv";
dotenv.config()
connectDB();

const app = express();
const httpServer = http.createServer(app);
// /* 
const frontEndUrl = process.env.FRONTEND_URL  || "http://localhost:3000";
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

// Handle preflight requests
app.options("*", cors(corsOptions));
// */ 

/*test:
app.use(cors())
*/

app.use(morgan("dev"));

app.use(cookieParser());
app.use(express.json());


app.use("/api/notification-service/", notificationRoutes);

initializeSocketIO(io);

app.use(errorHandler);

startConsumer()

const PORT = process.env.PORT

httpServer.listen(PORT, () => {
  console.log(`Notification Service is running on port ${PORT}`);
});

