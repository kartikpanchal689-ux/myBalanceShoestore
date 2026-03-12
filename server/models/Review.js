const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, default: "" },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  photos: [String],
  verified: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
  reply: { type: replySchema, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);