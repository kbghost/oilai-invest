const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [10, 'Minimum deposit is $10']
  },
  method: {
    type: String,
    enum: ['bitcoin', 'ethereum', 'usdt', 'bnb'],
    required: true
  },
  reference: {
    type: String,
    trim: true
  },
  proofImage: {
    type: String,  // File path or URL
    default: null
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Deposit', depositSchema);
