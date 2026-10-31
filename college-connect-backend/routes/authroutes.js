const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OTP = require("../models/OTP");
const { sendVerificationEmail } = require("../utils/emailService");

// Helper to validate institutional / college domain
const isCollegeEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const normalized = email.trim().toLowerCase();

  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicEmailRegex.test(normalized)) return false;

  // Allow bypass only if explicitly enabled in .env
  if (process.env.ALLOW_ALL_EMAILS === "true") return true;

  // Recognizes .edu, .ac.in, .edu.in, .ac.*, .edu.*, .res.in, and university domains
  const specificEduRegex = /@(.*\.)?(edu|ac\.[a-z]{2,3}|edu\.[a-z]{2,3}|res\.in)$/i;
  const eduDomainKeywordRegex = /@([a-zA-Z0-9-]+\.)*(college|university|univ|institute)(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/i;

  return specificEduRegex.test(normalized) || eduDomainKeywordRegex.test(normalized);
};

// ===============================
// Send Verification Code (OTP)
// ===============================
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "College email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Validate college domain
    if (!isCollegeEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter your official college/university email (e.g. ending in .edu, .ac.in, .edu.in)",
      });
    }

    // 2. Check if already registered
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "An account with this college email already exists. Please login.",
      });
    }

    // 3. Generate 6-digit code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Overwrite previous OTPs for this email
    await OTP.deleteMany({ email: normalizedEmail });
    await OTP.create({
      email: normalizedEmail,
      otp,
    });

    // 5. Send email via Nodemailer
    await sendVerificationEmail(normalizedEmail, otp);

    res.json({
      message: "Verification code sent to your college email",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({
      message: error.message || "Could not send verification code",
    });
  }
});

// ===============================
// Register with Verified OTP
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, college, otp } = req.body;

    if (!name?.trim() || !email?.trim() || !password || !college?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Validate college domain
    if (!isCollegeEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter your official college/university email (e.g. .edu, .ac.in)",
      });
    }

    // 2. Check existing user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }

    // 3. Validate OTP
    if (!otp || !otp.trim()) {
      return res.status(400).json({
        message: "Please provide the 6-digit verification code sent to your email",
      });
    }

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      otp: otp.trim(),
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid or expired verification code. Please request a new one.",
      });
    }

    // Clean up used OTP
    await OTP.deleteMany({ email: normalizedEmail });

    // 4. Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      college: college.trim(),
      isVerified: true,
    });

    res.status(201).json({
      message: "College email verified and account created successfully!",
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
