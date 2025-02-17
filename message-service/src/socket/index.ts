import cookie from "cookie";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { Server, Socket } from "socket.io";
import userCollection from "../models/userCollection";
import { ChatEventEnum } from "../utils/constants";

// Type-safe online users tracking
interface OnlineUser {
  userId: string;
  socketId: string;
  lastActive: number;
}

class SocketManager {
  private static instance: SocketManager;
  private onlineUsers: Map<string, OnlineUser> = new Map();

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public addUser(userId: string, socketId: string): void {
    this.onlineUsers.set(userId, {
      userId,
      socketId,
      lastActive: Date.now(),
    });
    this.cleanupInactiveUsers();
  }

  public removeUser(userId: string): void {
    this.onlineUsers.delete(userId);
  }

  public getUserSocketId(userId: string): string | undefined {
    return this.onlineUsers.get(userId)?.socketId;
  }

  public getAllOnlineUsers(): OnlineUser[] {
    return Array.from(this.onlineUsers.values());
  }

  private cleanupInactiveUsers(maxInactivityTime = 1000 * 60 * 30): void {
    const now = Date.now();
    this.onlineUsers.forEach((user, userId) => {
      if (now - user.lastActive > maxInactivityTime) {
        this.onlineUsers.delete(userId);
      }
    });
  }
}

function initializeSocketIO(io: Server) {
  const socketManager = SocketManager.getInstance();

  io.use(async (socket: Socket, next) => {
    try {
      // Extract token from multiple sources
      const token = extractToken(socket);
      console.log("token extracted from the message service");
      // Validate token
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        throw new Error("JWT Secret not configured");
      }

      const decodedToken: any = jwt.verify(token, JWT_SECRET);
      const user = await userCollection.findById(decodedToken?.userData?._id);

      if (!user) {
        throw new Error("User not found");
      }

      // Attach user to socket for further use
      socket.data.user = user;
      next();
    } catch (error: any) {
      next(new Error(error.message || "Authentication failed"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user;
    const userId = String(user._id);

    // Add user to online users
    socketManager.addUser(userId, socket.id);

    io.emit(ChatEventEnum.USER_ONLINE_EVENT, userId);

    // Emit connection event
    socket.emit(ChatEventEnum.CONNECTED_EVENT, { userId });
    console.log("User connected 🗼. userId:from message service", userId);
    // Join user's own room for direct messaging
    socket.join(userId);

    socket.on(ChatEventEnum.TYPING_EVENT, ({ convoId, userId }) => {
      socket.broadcast.emit(`${ChatEventEnum.TYPING_EVENT}-${convoId}`, userId);
    });

    socket.on(ChatEventEnum.CHECK_USER_ONLINE_EVENT, (checkUserId) => {
      // Check if user is in connected sockets and emit appropriate event
      const isUserOnline = socketManager.getUserSocketId(checkUserId);
      socket.emit(
        isUserOnline
          ? ChatEventEnum.USER_ONLINE_EVENT
          : ChatEventEnum.USER_OFFLINE_EVENT,
        checkUserId
      );
    });

    // Enhanced WebRTC Call Handling
    // Initiate Outgoing Call
    socket.on(
      "outgoing:call",
      (data: { fromOffer: any; to: string; callType?: "video" | "audio" }) => {
        const { fromOffer, to, callType = "video" } = data;
        const recipientSocketId = socketManager.getUserSocketId(to);

        if (recipientSocketId) {
          io.to(recipientSocketId).emit("incoming:call", {
            from: socket.id,
            offer: fromOffer,
            caller: userId,
            callType,
            callerInfo: {
              name: user.name,
              avatar: user.avatar,
            },
          });
        } else {
          console.log(`User ${to} is not online`);

          socket.emit("call:error", {
            message: `User ${to} is not online`,
            code: "USER_OFFLINE",
          });
        }
      }
    );

    // Handle Call Acceptance
    socket.on(
      "call:accepted",
      (data: { answer: any; to: string; callType?: "video" | "audio" }) => {
        const { answer, to, callType = "video" } = data;
        io.to(to).emit("incoming:answer", {
          offer: answer,
          caller: userId,
          callType,
        });
      }
    );

    // ICE Candidate Exchange
    socket.on("ice:candidate", (data: { candidate: any; to: string }) => {
      const { candidate, to } = data;
      const recipientSocketId = socketManager.getUserSocketId(to);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("ice:candidate", {
          candidate,
          from: socket.id,
          sender: userId,
        });
      }
    });

    // Call Rejection
    socket.on("call:rejected", (data: { to: string; reason?: string }) => {
      const { to, reason } = data;
      const recipientSocketId = socketManager.getUserSocketId(to);
    
      if (recipientSocketId) {
        // Changed to emit to the specific socket instead of the room
        socket.to(recipientSocketId).emit("call:rejected", {
          from: userId, // Changed from socket.id to userId for consistency
          reason: reason || "Call rejected"
        });
      }
    });

    socket.on("call:canceled", (data: { to: string }) => {
      const { to } = data;
      const recipientSocketId = socketManager.getUserSocketId(to);
    
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("call:canceled", {
          from: socket.id
        });
      }
    });

    // Additional WebRTC signaling events
    socket.on("call:missed", (data: { to: string }) => {
      const { to } = data;
      const recipientSocketId = socketManager.getUserSocketId(to);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("call:missed", {
          from: socket.id,
          caller: userId,
        });
      }
    });

    socket.on("end:call", (data) => {
      // Forward the end call event to the recipient
      io.to(data.to).emit("call:ended", {
        from: data.from,
      });
    });

    // Existing event handlers (Chat, Disconnect, etc.)
    socket.on(
      ChatEventEnum.MESSAGE_SENT_EVENT,
      handleChatMessage(io, socket, socketManager)
    );

    socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
      io.emit(ChatEventEnum.USER_OFFLINE_EVENT, userId);
      console.log(`User disconnected: ${userId}`);
      socketManager.removeUser(userId);
      socket.leave(userId);
    });
  });
}

// Existing utility functions remain the same
function extractToken(socket: Socket): string {
  const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
  let token = cookies?.token || socket.handshake.auth?.token;

  if (!token) {
    throw new Error("No authentication token provided");
  }

  return token;
}

const handleChatMessage =
  (io: Server, socket: Socket, socketManager: SocketManager) =>
  (messageData: { to: string; message: any }) => {
    const { to, message } = messageData;
    const recipientSocketId = socketManager.getUserSocketId(to);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit(ChatEventEnum.MESSAGE_RECEIVED_EVENT, {
        from: socket.data.user._id,
        message: message,
      });
    }
  };

const emitSocketEvent = (
  req: any,
  roomId: string,
  event: string,
  payload: any
): void => {
  const io: Server = req.app.get("io");
  io.in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent, SocketManager };
