import { io } from "socket.io-client";

// 🌍 Choose backend URL based on environment
const SERVER_URL =
  import.meta.env.MODE === "production"
    ? "https://the-living-garden.onrender.com" // 👈 replace with your Render app domain
    : "http://localhost:3001"; // local dev backend

export const socket = io(SERVER_URL, {
  autoConnect: false,
  transports: ["websocket"],
  path: "/socket.io", // default path
});