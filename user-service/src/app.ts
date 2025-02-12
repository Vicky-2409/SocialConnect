import express from "express";
import http from "http";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler"; // Adjust path as necessary
import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import { initializeSocketIO } from "./socket";
import connectDB from "./config/database";
connectDB();

const app = express();

const httpServer = http.createServer(app);

// CORS configuration
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
app.options("*", cors(corsOptions)); // Handle preflight requests

// Middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/user-service/", userRoutes);
app.use("/api/user-service/admin/", adminRoutes);

initializeSocketIO(io);

// Error Handling Middleware (must be last)
app.use(errorHandler);
const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`User Service is running on port ${PORT}`);
});
