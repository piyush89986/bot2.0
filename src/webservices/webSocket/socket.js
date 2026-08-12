import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_ENDPOINT_URL || "https://chatapplication-backend-ddk8.onrender.com";

export const socket = io(backendUrl, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});