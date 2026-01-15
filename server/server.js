const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user");

const app = express();
app.use(cors({
  origin: [
    "https://kartikpanchal689-ux.github.io",
    "https://nachal689-ux.github.io"
  ]
}));
app.use(express.json());

// ✅ Connect to MongoDB Atlas (not localhost)
mongoose.connect(process.env.MONGO_URI)
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
  user.otp = otp;
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
    user.otp = null;
    await user.save();
    return res.json({ success: true, message: "Login successful" });
  } else {
    return res.json({ success: false, message: "Invalid OTP" });
  }
});

// ✅ Use Render's dynamic port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
