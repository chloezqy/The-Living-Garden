
import { io } from 'socket.io-client';

// Ensure you replace this with your server's address in a real deployment
const SERVER_URL = 'http://localhost:3001';

export const socket = io(SERVER_URL, {
  autoConnect: false, // We will connect manually
});
