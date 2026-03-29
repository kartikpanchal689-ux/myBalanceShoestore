const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userEmail: { type: String, required: true },
  reasons: { type: [String], default: [] },
  feedback: { type: String, default: "" },
  status: { type: String, default: "Return in Process" }, // "Return in Process", "Approved", "Rejected"
  date: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Return", returnSchema);