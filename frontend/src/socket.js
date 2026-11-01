import { io } from "socket.io-client";

let socketURL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// Strip trailing /api and slashes for socket connection
socketURL = socketURL.trim().replace(/\/api\/?$/, "").replace(/\/+$/, "");

const socket = io(socketURL);

export default socket;
