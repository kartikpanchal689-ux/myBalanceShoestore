const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const router = express.Router();

// Temporary OTP store (for demo; use Redis/DB in production)
const otpStore = {};

// Generate random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();


// ---------------- PASSWORD LOGIN ----------------
router.post("/password-login", async (req, res) => {
 
  const identifier = req.body.identifier?.toLowerCase();
  const password = req.body.password;

  console.log("🔐 Login attempt:", identifier);

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash || user.password);
    if (!isMatch) {
      console.log("❌ Invalid password");
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    console.log("✅ Login success:", user.role);
    return res.status(200).json({
      success: true,
      role: user.role || "customer",
      message: `${user.role === "admin" ? "Admin" : "Customer"} login successful`
    });
  } catch (err) {
    console.error("🔥 Server error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});



// ---------------- SEND OTP ----------------
router.post("/login", async (req, res) => {
  const { identifier } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const otp = generateOtp();
    otpStore[identifier] = otp;

    console.log(`OTP for ${identifier}: ${otp}`);
    return res.status(200).json({ success: true, message: "OTP sent" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- VERIFY OTP ----------------
router.post("/verify-otp", async (req, res) => {
  const { identifier, otp } = req.body;

  const expectedOtp = otpStore[identifier];
  if (!expectedOtp || otp !== expectedOtp) {
    return res.status(401).json({ success: false, message: "Invalid OTP" });
  }
  delete otpStore[identifier];
  return res.status(200).json({ success: true, message: "Login successful" });
});

// ---------------- PING TEST ROUTE ----------------
router.post("/ping", (req, res) => {
  res.json({ success: true, message: "Ping route working" });
});

module.exports = router;
