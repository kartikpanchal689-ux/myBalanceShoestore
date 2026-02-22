const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  orderId: { type: String, required: true },
  trackingId: { type: String, required: true },
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  address: { type: String, required: true },
  estimatedDelivery: { type: String },
  status: { type: String, default: "Processing" },
  date: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);