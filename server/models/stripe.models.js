// payment.models.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  stripePaymentIntentId: {
    type: String,
    required: [true, 'Stripe Payment Intent ID is required'],
    unique: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'zar',
    lowercase: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'succeeded', 'failed', 'refunded'],
    default: 'pending'
  },
  eventID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  registrationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: [true, 'Registration ID is required']
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ userID: 1 });
paymentSchema.index({ eventID: 1 });
paymentSchema.index({ status: 1 });

paymentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);