const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  passwordHash: { type: String }, // optional if you want password login
  otp: Number, // temporary OTP
});

module.exports = mongoose.model("User", userSchema);

