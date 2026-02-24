const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: "" },
  description: { type: String, default: "" },
  colors: [String],
  sizes: [String],
  isNew: { type: Boolean, default: false },
  badge: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);