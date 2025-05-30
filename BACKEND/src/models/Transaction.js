const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  category: {
    type: String,
    enum: ['wallet_funding', 'electricity', 'airtime', 'data', 'transfer'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['wallet', 'card', 'bank_transfer', 'ussd']
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  balanceBefore: Number,
  balanceAfter: Number
}, {
  timestamps: true
});

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

