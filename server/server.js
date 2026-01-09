const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user");

const app = express();
app.use(cors());
app.use(express.json());

// connect to MongoDB (make sure MongoDB is running locally)
mongoose.connect("mongodb://127.0.0.1:27017/mybalance")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


// ------------------- REGISTER -------------------
app.post("/api/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const user = new User({ name, email, phone, passwordHash: password });
    await user.save();
    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ------------------- LOGIN -------------------
app.post("/api/login", async (req, res) => {
  const { identifier } = req.body;

  const user = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  });

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  user.otp = otp; // save to user document
  await user.save();

  console.log(`OTP for ${identifier}: ${otp}`);

  res.json({ success: true, message: "OTP sent" });
});


// ------------------- VERIFY OTP -------------------
app.post("/api/verify-otp", async (req, res) => {
  const { identifier, otp } = req.body;

  const user = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  });

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  if (user.otp === parseInt(otp)) {
    user.otp = null; // clear OTP after use
    await user.save();
    return res.json({ success: true, message: "Login successful" });
  } else {
    return res.json({ success: false, message: "Invalid OTP" });
  }
});


// ------------------- START SERVER -------------------
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
