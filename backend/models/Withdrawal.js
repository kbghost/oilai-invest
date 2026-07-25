const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [10, 'Minimum withdrawal is $10']
  },
  fee: {
    type: Number,
    required: true
  },
  netAmount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    enum: ['bitcoin', 'ethereum', 'usdt', 'bnb'],
    required: true
  },
  walletAddress: {
    type: String,
    required: [true, 'Wallet address or account is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNote: {
    type: String,
    default: null
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  processedAt: {
    type: Date,
    default: null
  },
  txHash: {
    type: String,
    default: null  // Transaction hash once processed
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
