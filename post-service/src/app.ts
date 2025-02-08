import express from "express";
import startConsumer from "./rabbitMq/startConsumer";
import postsRoutes from "./routes/postsRoutes";
import commentsRoutes from "./routes/commentsRoutes";
import reportsRoutes from "./routes/reportsRoutes";
import adminRoutes from "./routes/adminRoutes";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler";
import {connectDB}  from './config/database';
dotenv.config();

const app = express();

// /* 
const frontEndUrl = process.env.FRONTEND_URL;
const corsOptions = {
  origin: frontEndUrl,
  credentials: true,
};

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

app.use("/api/posts-service/comment", commentsRoutes);
app.use("/api/posts-service/report", reportsRoutes);
app.use("/api/posts-service/admin", adminRoutes);
app.use("/api/posts-service/", postsRoutes);

app.use(errorHandler);

startConsumer();
connectDB();

const PORT = process.env.PORT  || 5002;

app.listen(PORT, () => {
    console.log(`Post Service is running on port ${PORT}`);
  });