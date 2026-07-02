import { io } from "socket.io-client";

let socket = null;

export const connectChatSocket = (token, sessionId = null) => {
  if (socket?.connected) return socket;

  socket = io("http://localhost:5000", {
    auth: { token, sessionId },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on("connect_error", (err) => {
    console.error("Chat socket error:", err.message);
  });

  return socket;
};

export const disconnectChatSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

export const getChatSocket = () => socket;

export const sendChatMessage = (message) => {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject(new Error("Socket not connected."));
      return;
    }
    socket.emit("chat:send", { message }, (response) => {
      if (response.success) {
        resolve(response.message);
      } else {
        reject(new Error(response.error || "Failed to send."));
      }
    });
  });
};
