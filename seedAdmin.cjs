require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

async function seedAdmin() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected");

    // Define schema inline to avoid buffering issues
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, default: "customer" }
    });

    const User = mongoose.model("User", userSchema);

    console.log("🔍 Checking if admin exists...");
    const existingAdmin = await User.findOne({ email: "admin@example.com" });

    if (existingAdmin) {
      console.log("⚠️ Admin user already exists");
      return mongoose.disconnect();
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash("admin123", 10);

    console.log("📦 Creating admin user...");
    const admin = new User({
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    console.log("✅ Admin user seeded");
  } catch (err) {
    console.error("❌ Failed to seed admin:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

seedAdmin();
