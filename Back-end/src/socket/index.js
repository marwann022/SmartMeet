import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { registerCommunityChat } from "./communityChat.socket.js";

const userSockets = new Map();
const sessionSockets = new Map();

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication required."));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).populate("community", "_id name");
      if (!user) {
        return next(new Error("User not found."));
      }

      socket.user = user;
      socket.sessionId = socket.handshake.auth.sessionId || decoded.sessionId || null;
      next();
    } catch (error) {
      next(new Error("Invalid token."));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);

    if (socket.sessionId) {
      sessionSockets.set(socket.sessionId.toString(), socket);
    }

    registerCommunityChat(io, socket, userSockets);

    socket.on("disconnect", () => {
      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
        }
      }

      if (socket.sessionId) {
        const current = sessionSockets.get(socket.sessionId.toString());
        if (current && current.id === socket.id) {
          sessionSockets.delete(socket.sessionId.toString());
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized.");
  }
  return io;
};

export const getUserSockets = () => userSockets;

export const getSocketBySessionId = (sessionId) => {
  return sessionSockets.get(sessionId.toString()) || null;
};
