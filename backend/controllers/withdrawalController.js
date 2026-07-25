const { validationResult } = require('express-validator');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

// ─── CREATE WITHDRAWAL REQUEST ────────────────────────────────────────────────
const createWithdrawal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { amount, method, walletAddress } = req.body;
    const user = await User.findById(req.user._id);

    if (user.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance.' });
    }

    if (amount < 10) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal is $10.' });
    }

    const fee = parseFloat((amount * 0.02).toFixed(2));
    const netAmount = parseFloat((amount - fee).toFixed(2));

    // Freeze balance
    user.balance -= amount;
    await user.save({ validateBeforeSave: false });

    const withdrawal = await Withdrawal.create({
      user: req.user._id,
      amount,
      fee,
      netAmount,
      method,
      walletAddress
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted. Processing takes 45 minutes.',
      withdrawal
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── GET USER WITHDRAWALS ────────────────────────────────────────────────────
const getUserWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, withdrawals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── ADMIN: GET ALL WITHDRAWALS ───────────────────────────────────────────────
const getAllWithdrawals = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const withdrawals = await Withdrawal.find(filter)
      .populate('user', 'firstName lastName email balance')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Withdrawal.countDocuments(filter);

    res.json({ success: true, withdrawals, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── ADMIN: APPROVE WITHDRAWAL ────────────────────────────────────────────────
const approveWithdrawal = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ success: false, message: 'Withdrawal not found.' });
    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Withdrawal already processed.' });
    }

    withdrawal.status = 'approved';
    withdrawal.processedBy = req.user._id;
    withdrawal.processedAt = new Date();
    withdrawal.adminNote = req.body.note || null;
    withdrawal.txHash = req.body.txHash || null;
    await withdrawal.save();

    res.json({ success: true, message: 'Withdrawal approved and processed.', withdrawal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── ADMIN: REJECT WITHDRAWAL ─────────────────────────────────────────────────
const rejectWithdrawal = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ success: false, message: 'Withdrawal not found.' });
    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Withdrawal already processed.' });
    }

    // Refund balance
    await User.findByIdAndUpdate(withdrawal.user, {
      $inc: { balance: withdrawal.amount }
    });

    withdrawal.status = 'rejected';
    withdrawal.processedBy = req.user._id;
    withdrawal.processedAt = new Date();
    withdrawal.adminNote = req.body.note || 'Rejected by admin';
    await withdrawal.save();

    res.json({ success: true, message: 'Withdrawal rejected. Balance refunded.', withdrawal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  createWithdrawal,
  getUserWithdrawals,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal
};
