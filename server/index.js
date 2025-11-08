import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import {
  upsertSpirit,
  updateSpiritState,
  removeSpirit,
  getWorld,
} from "./worldState.js";

// 🔧 Resolve directory (since ES modules don’t have __dirname by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve your built React frontend (from /dist after `npm run build`)
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// ✅ Handle all unknown routes → return index.html (for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// 🪶 Create the HTTP + WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // On Render, your frontend will be on same domain anyway
    methods: ["GET", "POST"],
  },
});

// 🌱 Maintain synchronized world state
io.on("connection", (socket) => {
  console.log(`🪶 Client connected: ${socket.id}`);

  socket.on("spirit:upsert", (spirit) => {
    socket.spiritId = spirit.id;
    upsertSpirit(spirit);
    io.emit("world:update", getWorld());
  });

  socket.on("spirit:state", ({ id, activityState }) => {
    updateSpiritState(id, activityState);
  });

  socket.on("disconnect", () => {
    console.log(`👋 Client disconnected: ${socket.id}`);
    if (socket.spiritId) {
      removeSpirit(socket.spiritId);
      io.emit("world:update", getWorld());
    }
  });
});

// 🕒 Broadcast world state every second
setInterval(() => io.emit("world:update", getWorld()), 1000);

// 🌿 Start server
server.listen(PORT, () => {
  console.log(`🌿 The Living Garden running on port ${PORT}`);
});