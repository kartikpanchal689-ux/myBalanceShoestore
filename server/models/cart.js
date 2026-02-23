const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  items: { type: Array, default: [] },
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);