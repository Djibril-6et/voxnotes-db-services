const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  stripeSessionId: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active',
  },
  paymentMethod: {
    type: String,
    enum: ['Stripe', 'Paypal'],
    default: 'Stripe',
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);