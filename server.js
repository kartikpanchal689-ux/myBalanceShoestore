require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./server/models/user");
const authRoutes = require("./server/routes/api/auth");

const app = express();
app.use(cors({
  origin: [
    "https://kartikpanchal689-ux.github.io",
    "https://nachal689-ux.github.io"
  ]
}));
app.use(express.json());

// ✅ Mount all login routes
app.use("/api", authRoutes);

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

mongoose.connection.on("connected", () => {
  console.log("🔍 Connected to DB:", mongoose.connection.name);
});

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

// ✅ Use Render's dynamic port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
