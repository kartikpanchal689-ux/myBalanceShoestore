const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  phone: { type: String },
  passwordHash: { type: String },
  password: { type: String },
  role: { type: String, default: "customer" },
  otp: Number,
});

module.exports = mongoose.model("User", userSchema);