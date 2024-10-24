// models/review.models.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5, },
  feedback: { type: String, required: true },
  userID: { type: String, required: true }, 
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
