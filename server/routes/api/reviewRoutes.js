const express = require("express");
const Review = require("../../models/review");
const router = express.Router();

// Get reviews for a product
router.get("/reviews/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Submit a review
router.post("/reviews", async (req, res) => {
  try {
    const { productId, productName, userName, userEmail, rating, comment, photos } = req.body;
    if (!productId || !userName || !userEmail || !rating || !comment) {
      return res.json({ success: false, message: "All fields required" });
    }
    const review = new Review({ productId, productName, userName, userEmail, rating, comment, photos: photos || [] });
    await review.save();

    // Broadcast via SSE
    const allClients = Object.values(global.sseClients || {}).flat();
    allClients.forEach(client => {
      client.write(`data: ${JSON.stringify({ type: "REVIEW_ADDED", payload: review })}\n\n`);
    });

    res.json({ success: true, review });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Get ALL reviews (admin)
router.get("/admin/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Admin reply to a review
router.post("/admin/reviews/:id/reply", async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) return res.json({ success: false, message: "Reply cannot be empty" });
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { reply: { comment, date: new Date() } },
      { new: true }
    );
    if (!review) return res.json({ success: false, message: "Review not found" });

    // Broadcast via SSE
    const allClients = Object.values(global.sseClients || {}).flat();
    allClients.forEach(client => {
      client.write(`data: ${JSON.stringify({ type: "REVIEW_REPLIED", payload: review })}\n\n`);
    });

    res.json({ success: true, review });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Delete a review (admin)
router.delete("/admin/reviews/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Mark helpful
router.patch("/reviews/:id/helpful", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    res.json({ success: true, helpful: review.helpful });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;