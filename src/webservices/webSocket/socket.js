import { io } from "socket.io-client"

export const socket = io(import.meta.env.VITE_ENDPOINT_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});