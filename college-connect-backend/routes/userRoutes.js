const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const Note = require("../models/Note");
const Project = require("../models/Project");

// ===============================
// Logged-in User
// ===============================
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/dashboard-stats", auth, async (req, res) => {
  try {
    const [user, messages, notes, projects] = await Promise.all([
      User.findById(req.user.id).select("connections"),
      Message.countDocuments({ $or: [{ sender: req.user.id }, { receiver: req.user.id }] }),
      Note.countDocuments({ author: req.user.id }),
      Project.countDocuments(),
    ]);
    res.json({ connections: user?.connections.length || 0, messages, notes, projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not load dashboard statistics" });
  }
});

// ===============================
// Update Profile
// ===============================
router.put("/update-profile", auth, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.json({
      message: "Profile Updated Successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ===============================
// Discover Students
// ===============================
router.get("/discover", auth, async (req, res) => {
  try {
    const users = await User.find({
      _id: {
        $ne: req.user.id,
      },
    }).select("-password");

    res.json(users);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ===============================
// Send Connection Request
// ===============================
router.post("/connect/:id", auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    const otherUser = await User.findById(req.params.id);

    if (!otherUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (req.user.id === req.params.id) {
      return res.status(400).json({
        message: "You cannot connect with yourself",
      });
    }

    if (otherUser.connections.includes(me._id)) {
      return res.status(400).json({
        message: "Already connected",
      });
    }

    if (otherUser.connectionRequests.includes(me._id)) {
      return res.status(400).json({
        message: "Connection request already sent",
      });
    }

    otherUser.connectionRequests.push(me._id);

    await otherUser.save();

    res.json({
      message: "Connection request sent",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ===============================
// Accept Connection Request
// ===============================
router.post("/accept/:id", auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    const otherUser = await User.findById(req.params.id);

    if (!otherUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!me.connectionRequests.includes(otherUser._id)) {
      return res.status(400).json({
        message: "No connection request found",
      });
    }

    me.connectionRequests = me.connectionRequests.filter(
      (id) => id.toString() !== otherUser._id.toString()
    );

    if (!me.connections.includes(otherUser._id)) {
      me.connections.push(otherUser._id);
    }

    if (!otherUser.connections.includes(me._id)) {
      otherUser.connections.push(me._id);
    }

    await me.save();
    await otherUser.save();

    res.json({
      message: "Connection Accepted",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ===============================
// Pending Requests
// ===============================
router.get("/requests", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("connectionRequests", "-password");

    res.json(user.connectionRequests);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ===============================
// My Connections
// ===============================
router.get("/connections", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("connections", "-password");

    res.json(user.connections);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// Get user by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
