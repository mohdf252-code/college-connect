const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const User = require("./models/User");
require("dotenv").config();

const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userRoutes");
const createMessageRoutes = require("./routes/messageRoutes");
const noteRoutes = require("./routes/noteRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Health check routes
app.get("/", (req, res) => {
  res.json({ message: "College Connect API is online and running!", timestamp: new Date() });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Routes (supporting both /api/* and /* prefixes to prevent 404 mismatches)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/users", userRoutes);

app.use("/api/notes", noteRoutes);
app.use("/notes", noteRoutes);

app.use("/api/projects", projectRoutes);
app.use("/projects", projectRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const messageRouter = createMessageRoutes(io);
app.use("/api/messages", messageRouter);
app.use("/messages", messageRouter);

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // User comes online
  socket.on("join", async (userId) => {
    try {
      if (!userId) {
        console.log("❌ JOIN FAILED: No user ID received");
        return;
      }

      socket.userId = userId;
      socket.join(userId);

      await User.findByIdAndUpdate(userId, {
        isOnline: true,
      });

      console.log("USER JOINED:", userId);
      console.log("USER IS ONLINE:", userId);

      io.emit("userOnline", userId);
    } catch (err) {
      console.log("JOIN ERROR:", err);
    }
  });

  // Real-time 1-on-1 messages
  socket.on("sendMessage", (data) => {
    io.to(data.receiver).emit("receiveMessage", data);
  });

  // Real-time Campus Doubts & Chitchat messages
  socket.on("sendCommunityMessage", (data) => {
    io.emit("receiveCommunityMessage", data);
  });

  // Typing indicator
  socket.on("typing", (data) => {
    io.to(data.receiver).emit("userTyping", {
      sender: data.sender,
    });
  });

  socket.on("stopTyping", (data) => {
    io.to(data.receiver).emit("userStoppedTyping", {
      sender: data.sender,
    });
  });

  // User goes offline
  socket.on("disconnect", async () => {
    try {
      if (socket.userId) {
        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
        });

        io.emit("userOffline", socket.userId);
        console.log(`${socket.userId} is offline`);
      }

      console.log("User Disconnected:", socket.id);
    } catch (err) {
      console.log(err);
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
