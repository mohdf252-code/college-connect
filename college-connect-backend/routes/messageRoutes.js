const express = require("express");
const Message = require("../models/Message");
const CommunityMessage = require("../models/CommunityMessage");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

module.exports = (io) => {
  const router = express.Router();

  // Send a 1-on-1 message
  router.post("/send", auth, async (req, res) => {
    try {
      const { receiver, text } = req.body;

      const message = await Message.create({
        sender: req.user.id,
        receiver,
        text,
      });

      // Send the message instantly to receiver
      io.to(receiver).emit("receiveMessage", message);

      res.status(201).json({
        message: "Message sent",
        data: message,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Server Error",
      });
    }
  });

  // Get chat list / conversations
  router.get("/conversations", auth, async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [{ sender: req.user.id }, { receiver: req.user.id }],
      }).sort({ createdAt: -1 });

      const latestByUser = new Map();
      messages.forEach((message) => {
        const otherId = message.sender.toString() === req.user.id
          ? message.receiver.toString()
          : message.sender.toString();
        if (!latestByUser.has(otherId)) latestByUser.set(otherId, message);
      });

      const users = await User.find({ _id: { $in: [...latestByUser.keys()] } })
        .select("name branch profilePic isOnline");
      const userById = new Map(users.map((user) => [user._id.toString(), user]));

      const conversations = [...latestByUser.entries()]
        .map(([userId, lastMessage]) => ({ user: userById.get(userId), lastMessage }))
        .filter((conversation) => conversation.user);
      res.json(conversations);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Could not load conversations" });
    }
  });

  // Campus Community Doubts & Chitchats - GET messages
  router.get("/community", auth, async (req, res) => {
    try {
      const messages = await CommunityMessage.find()
        .populate("sender", "name branch college profilePic")
        .sort({ createdAt: 1 })
        .limit(100);

      res.json(messages);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Could not load community messages" });
    }
  });

  // Campus Community Doubts & Chitchats - SEND message
  router.post("/community", auth, async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || !text.trim()) {
        return res.status(400).json({ message: "Message cannot be empty" });
      }

      const message = await CommunityMessage.create({
        sender: req.user.id,
        text: text.trim(),
      });

      await message.populate("sender", "name branch college profilePic");

      // Broadcast to everyone in real-time
      io.emit("receiveCommunityMessage", message);

      res.status(201).json({
        message: "Message sent",
        data: message,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Could not send community message" });
    }
  });

  // Get chat with another user
  router.get("/:userId", auth, async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [
          {
            sender: req.user.id,
            receiver: req.params.userId,
          },
          {
            sender: req.params.userId,
            receiver: req.user.id,
          },
        ],
      }).sort({ createdAt: 1 });

      res.json(messages);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Server Error",
      });
    }
  });

  return router;
};
