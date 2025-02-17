import { Server, Socket } from "socket.io";

import jwt from "jsonwebtoken";
import userCollection, { IUser } from "../models/User";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

console.log(process.env.JWT_SECRET); // Debugging step to ensure the variable is loaded
import { SocketEventEnum } from "../utils/constants";
declare module "socket.io" {
  interface Socket {
    user?: any; // You can define the type of user based on your application
  }
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

// Store connected users in a map to emit to specific users
const userSockets: { [userId: string]: Socket } = {};

const initializeSocketIO = (io: Server) => {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
        if (err) {
          return next(new Error("Authentication error"));
        }

        socket.data.user = decoded; // Store the user data on the socket

        try {
          const user = await userCollection.findById(decoded?.userData?._id);
          if (!user) {
            return next(new Error("User not found"));
          }

          socket.user = user; // Attach user to socket
          userSockets[user._id.toString()] = socket; // Store the socket per user
          next();
        } catch (err) {
          next(new Error("Error fetching user from the database"));
        }
      });
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log("A user connected: " + socket.user._id);
    const userId = socket.user._id;
    console.log("Emitting connected event with userId:", userId);

    emitNotification(userId.toString(), "user-connected", { userId });

    // Emit both standard and custom events
    socket.emit("user-connected", {
      userId: userId.toString(), // Convert ObjectId to string
    });
    socket.emit("connected", { userId }); // Custom event

    // Listen for test event
    socket.on("test-connection", (data) => {
      console.log("Test connection received:", data);
    });

    // Handle socket events after authentication
    socket.on("message", (data) => {
      console.log("Message received:", data);
      socket.emit("message-response", "Message received on the server");
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected: " + socket.id);
      // Remove the socket when user disconnects
      const userId = socket.user?._id.toString();
      if (userId) {
        delete userSockets[userId];
      }
    });
  });
};

// Function to emit notifications
const emitNotification = (userId: string, event: string, payload: any) => {
  const userSocket = userSockets[userId];
  if (userSocket) {
    userSocket.emit(event, payload); // Emit the notification to the specific user
  }
};

// Example function to handle like event
const handlePostLike = (postId: string, userId: string) => {
  // Find the post owner
  // Assuming you have a method to get the post owner
  const postOwnerId = "getPostOwnerId(postId)"; // replace with your actual method to get post owner

  if (postOwnerId) {
    emitNotification(postOwnerId, "new-like", { postId, userId });
  }
};

// Example function to handle follow event
const handleFollow = (followerId: string, followedData: IUser) => {
  // emitNotification(followedId, "new-follower", { followerId });
  // emitNotification(followerId, "new-follower", followedData);
};

export { initializeSocketIO, emitNotification, handlePostLike, handleFollow };
