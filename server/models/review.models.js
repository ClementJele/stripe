// // // models/review.models.js

// // const mongoose = require('mongoose');

// // const reviewSchema = new mongoose.Schema({
// //   rating: { type: Number, required: true, min: 1, max: 5, },
// //   feedback: { type: String, required: true },
// //   userID: { type: String, required: true }, 
// //   date: { type: Date, default: Date.now }
// // });

// // module.exports = mongoose.model('Review', reviewSchema);


// // Review Model
// // review.models.js
// const mongoose = require('mongoose');

// const reviewSchema = new mongoose.Schema({
//   rating: {
//     type: Number,
//     required: [true, 'Rating is required'],
//     min: 1,
//     max: 5
//   },
//   feedback: {
//     type: String,
//     required: [true, 'Feedback is required'],
//     trim: true,
//     minlength: [10, 'Feedback must be at least 10 characters long']
//   },
//   userID: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: [true, 'User ID is required']
//   },
//   eventID: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Event',
//     required: [true, 'Event ID is required']
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Review', reviewSchema);

// models/review.models.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  feedback: { 
    type: String, 
    required: true,
    minlength: 1,
    maxlength: 1000
  },
  userID: { 
    type: String, 
    required: true 
  }, 
  date: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
  collection: "Reviews"
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
