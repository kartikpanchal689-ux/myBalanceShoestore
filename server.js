require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./server/models/user");
const authRoutes = require("./server/routes/api/auth");
const orderRoutes = require("./server/routes/api/orders");
const cartRoutes = require("./server/routes/api/cartRoutes");

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: [
    "https://kartikpanchal689-ux.github.io",
    "https://nachal689-ux.github.io"
  ]
}));
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Server is working" });
});

app.use("/api", authRoutes);
app.use("/api", orderRoutes);
app.use("/api", cartRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

mongoose.connection.on("connected", () => {
  console.log("🔍 Connected to DB:", mongoose.connection.name);
});

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

// SSE clients store
const sseClients = {};
global.sseClients = sseClients;

global.emitToUser = (userId, event) => {
  const clients = sseClients[userId] || [];
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(event)}\n\n`);
  });
};

// SSE endpoint
app.get("/api/sync/:userId", (req, res) => {
  const userId = req.params.userId;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  if (!sseClients[userId]) sseClients[userId] = [];
  sseClients[userId].push(res);
  console.log(`✅ SSE connected for user: ${userId}`);

  req.on("close", () => {
    sseClients[userId] = sseClients[userId].filter(client => client !== res);
    console.log(`❌ SSE disconnected for user: ${userId}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));