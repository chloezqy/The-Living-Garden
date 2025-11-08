import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { upsertSpirit, updateSpiritState, removeSpirit, getWorld } from "./worldState.js";
import spiritRoute from "./routes/spirit.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log("🔍 OPENAI_API_KEY loaded:", process.env.OPENAI_API_KEY ? "YES" : "NO");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/spirit", spiritRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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

setInterval(() => io.emit("world:update", getWorld()), 1000);

server.listen(PORT, () => {
  console.log(`🌿 Living Garden server running on http://localhost:${PORT}`);
});
