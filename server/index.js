
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { upsertSpirit, updateSpiritState, removeSpirit, getWorld } from './worldState.js';

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors()); // Enable CORS for all routes

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity in this MVP
    methods: ["GET", "POST"],
  },
});

// REST endpoint to get a snapshot of the current world state
app.get('/world', (req, res) => {
  res.json(getWorld());
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle a new or returning spirit
  socket.on('spirit:upsert', (spirit) => {
    // Associate spirit ID with socket ID for cleanup on disconnect
    socket.spiritId = spirit.id;
    upsertSpirit(spirit);
    // Broadcast the update immediately
    io.emit('world:update', getWorld());
  });

  // Handle spirit activity state changes
  socket.on('spirit:state', ({ id, activityState }) => {
    updateSpiritState(id, activityState);
    // No broadcast here; state changes are sent with the heartbeat
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    if (socket.spiritId) {
      // For this MVP, we remove the spirit on disconnect.
      // A more robust solution might set them to 'sleep' for a while to allow reconnection.
      removeSpirit(socket.spiritId);
      io.emit('world:update', getWorld());
    }
  });
});

// Heartbeat to broadcast world state every second
setInterval(() => {
  io.emit('world:update', getWorld());
}, 1000);


server.listen(PORT, () => {
  console.log(`Living Garden server listening on *:${PORT}`);
});
