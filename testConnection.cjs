require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ Connection failed:", err.message);
  });
