const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed with bcrypt
  role: { type: String, default: "customer" } // NEW: "customer" or "admin"
});


module.exports = mongoose.model("User", userSchema);
