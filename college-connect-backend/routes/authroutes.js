const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===============================
// Register (no OTP required)
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, college } = req.body;

    if (!name?.trim() || !email?.trim() || !password || !college?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      college: college.trim(),
      isVerified: true,
    });

    res.status(201).json({
      message: "Account created successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      message: "Server Error during registration",
    });
  }
});

// ===============================
// Login
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
