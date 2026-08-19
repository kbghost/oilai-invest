const User = require('../models/User');
const Investment = require('../models/Investment');
const Deposit = require('../models/Deposit');
const Withdrawal = require('../models/Withdrawal');

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────
const getDashboardStats = async(req, res) => {
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
        console.error('[ADMIN STATS ERROR]', error);
        res.status(500).json({ success: false, message: error.message || 'Server error.' });
    }
};

// ─── GET ALL USERS ────────────────────────────────────────────────────────────
const getAllUsers = async(req, res) => {
    try {
        const { page = 1, limit = 50, search } = req.query;
        const filter = { role: { $ne: 'admin' } };
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(filter)
            .sort({ createdAt: -1 })
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));

        const total = await User.countDocuments(filter);

        res.json({ success: true, users, total, pages: Math.ceil(total / parseInt(limit)) });
    } catch (error) {
        console.error('[ADMIN GET USERS ERROR]', error);
        res.status(500).json({ success: false, message: error.message || 'Server error.' });
    }
};

// ─── TOGGLE USER ACTIVE STATUS ────────────────────────────────────────────────
const toggleUserStatus = async(req, res) => {
    try {
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ success: false, message: 'You cannot deactivate your own administrator account.' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        user.isActive = !user.isActive;
        await user.save({ validateBeforeSave: false });

        res.json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'banned'} successfully.`,
            user
        });
    } catch (error) {
        console.error('[ADMIN TOGGLE USER ERROR]', error);
        res.status(500).json({ success: false, message: error.message || 'Server error.' });
    }
};

// ─── MANUALLY ADJUST USER BALANCE ────────────────────────────────────────────
const adjustBalance = async(req, res) => {
    try {
        const { amount, type, note } = req.body; // type: 'credit' | 'debit'
        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Please enter a valid amount greater than 0.' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        if (type === 'credit') {
            user.balance = parseFloat(((user.balance || 0) + numAmount).toFixed(2));
        } else {
            if ((user.balance || 0) < numAmount) {
                return res.status(400).json({ success: false, message: 'User balance is insufficient for this debit.' });
            }
            user.balance = parseFloat(((user.balance || 0) - numAmount).toFixed(2));
        }

        await user.save({ validateBeforeSave: false });
        res.json({ success: true, message: `Balance ${type === 'credit' ? 'credited' : 'debited'} successfully.`, user });
    } catch (error) {
        console.error('[ADMIN ADJUST BALANCE ERROR]', error);
        res.status(500).json({ success: false, message: error.message || 'Server error.' });
    }
};

module.exports = { getDashboardStats, getAllUsers, toggleUserStatus, adjustBalance };