import { io } from "socket.io-client";

let socket;

export function getSocket(userId) {
  if (!socket) {
    socket = io("https://mybalanceshoestore.onrender.com", {
      path: "/ws",
      transports: ["polling"],
      auth: { userId }
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}