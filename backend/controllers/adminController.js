const User = require('../models/User');
const Investment = require('../models/Investment');
const Deposit = require('../models/Deposit');
const Withdrawal = require('../models/Withdrawal');

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeInvestments,
      pendingDeposits,
      pendingWithdrawals,
      totalDepositsAgg,
      totalWithdrawalsAgg,
      recentUsers
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Investment.countDocuments({ status: 'active' }),
      Deposit.countDocuments({ status: 'pending' }),
      Withdrawal.countDocuments({ status: 'pending' }),
      Deposit.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Withdrawal.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(5).select('firstName lastName email createdAt balance')
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeInvestments,
        pendingDeposits,
        pendingWithdrawals,
        totalDeposits: totalDepositsAgg[0]?.total || 0,
        totalWithdrawals: totalWithdrawalsAgg[0]?.total || 0
      },
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── GET ALL USERS ────────────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = { role: 'user' };
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── TOGGLE USER ACTIVE STATUS ────────────────────────────────────────────────
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── MANUALLY ADJUST USER BALANCE ────────────────────────────────────────────
const adjustBalance = async (req, res) => {
  try {
    const { amount, type, note } = req.body; // type: 'credit' | 'debit'
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (type === 'credit') {
      user.balance += parseFloat(amount);
    } else {
      if (user.balance < amount) {
        return res.status(400).json({ success: false, message: 'Insufficient user balance.' });
      }
      user.balance -= parseFloat(amount);
    }

    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: 'Balance adjusted.', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getDashboardStats, getAllUsers, toggleUserStatus, adjustBalance };
