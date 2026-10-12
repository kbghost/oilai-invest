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
            totalInvestedAgg,
            totalBalancesAgg,
            bannedUsers,
            verifiedUsers,
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
            Investment.aggregate([
                { $match: { status: { $in: ['active', 'completed'] } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            User.aggregate([
                { $group: { _id: null, total: { $sum: '$balance' } } }
            ]),
            User.countDocuments({ role: 'user', isActive: false }),
            User.countDocuments({ role: 'user', isVerified: true }),
            User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(5).select('firstName lastName email phone country createdAt balance totalInvested isVerified isActive')
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                activeInvestments,
                pendingDeposits,
                pendingWithdrawals,
                totalDeposits: totalDepositsAgg[0]?.total || 0,
                totalWithdrawals: totalWithdrawalsAgg[0]?.total || 0,
                totalInvested: totalInvestedAgg[0]?.total || 0,
                totalUserBalances: totalBalancesAgg[0]?.total || 0,
                bannedUsers,
                verifiedUsers
            },
            recentUsers
        });
    } catch (error) {
        console.error('[ADMIN STATS ERROR]', error);
        res.status(500).json({ success: false, message: error.message || 'Server error.' });
    }
};

// ─── GET ALL USERS (WITH ADVANCED FILTERING, SORTING & STATS) ─────────────────
const getAllUsers = async(req, res) => {
    try {
        const { 
            page = 1, 
            limit = 50, 
            search, 
            status, 
            isVerified, 
            role, 
            sortBy = 'createdAt', 
            sortOrder = 'desc' 
        } = req.query;

        const filter = {};

        // Role filtering (default: exclude admin unless requested)
        if (role === 'all') {
            // Include all
        } else if (role) {
            filter.role = role;
        } else {
            filter.role = { $ne: 'admin' };
        }

        // Status filter
        if (status === 'active') {
            filter.isActive = true;
        } else if (status === 'banned') {
            filter.isActive = false;
        }

        // Verification filter
        if (isVerified === 'true') {
            filter.isVerified = true;
        } else if (isVerified === 'false') {
            filter.isVerified = false;
        }

        // Multi-field search
        if (search && search.trim()) {
            const query = search.trim();
            filter.$or = [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } },
                { referralCode: { $regex: query, $options: 'i' } }
            ];
        }

        // Sorting
        const sortOptions = {};
        const allowedSortFields = ['createdAt', 'balance', 'totalInvested', 'firstName', 'lastLogin'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
        sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;

        const users = await User.find(filter)
            .populate('referredBy', 'firstName lastName email referralCode')
            .sort(sortOptions)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));

        const total = await User.countDocuments(filter);

        // Aggregate statistics for quick summary headers
        const [totalAllUsers, activeCount, bannedCount, verifiedCount, balancesAgg, investedAgg] = await Promise.all([
            User.countDocuments({ role: { $ne: 'admin' } }),
            User.countDocuments({ role: { $ne: 'admin' }, isActive: true }),
            User.countDocuments({ role: { $ne: 'admin' }, isActive: false }),
            User.countDocuments({ role: { $ne: 'admin' }, isVerified: true }),
            User.aggregate([
                { $match: { role: { $ne: 'admin' } } },
                { $group: { _id: null, total: { $sum: '$balance' } } }
            ]),
            User.aggregate([
                { $match: { role: { $ne: 'admin' } } },
                { $group: { _id: null, total: { $sum: '$totalInvested' } } }
            ])
        ]);

        const summaryStats = {
            totalUsers: totalAllUsers,
            activeUsers: activeCount,
            bannedUsers: bannedCount,
            verifiedUsers: verifiedCount,
            totalBalances: balancesAgg[0]?.total || 0,
            totalInvested: investedAgg[0]?.total || 0
        };

        res.json({ 
            success: true, 
            users, 
            total, 
            pages: Math.ceil(total / parseInt(limit)),
            stats: summaryStats
        });
    } catch (error) {
        console.error('[ADMIN GET USERS ERROR]', error);
        res.status(500).json({ success: false, message: error.message || 'Server error.' });
    }
};

// ─── GET COMPLETE 360° USER DETAILS ───────────────────────────────────────────
const getUserDetails = async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('referredBy', 'firstName lastName email referralCode phone country');
            
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const [
            investments,
            deposits,
            withdrawals,
            referrals
        ] = await Promise.all([
            Investment.find({ user: user._id }).sort({ createdAt: -1 }),
            Deposit.find({ user: user._id }).sort({ createdAt: -1 }),
            Withdrawal.find({ user: user._id }).sort({ createdAt: -1 }),
            User.find({ referredBy: user._id })
                .select('firstName lastName email phone createdAt balance totalInvested isVerified isActive')
                .sort({ createdAt: -1 })
        ]);

        const totalDeposited = deposits
            .filter(d => d.status === 'approved')
            .reduce((sum, d) => sum + (d.amount || 0), 0);

        const totalWithdrawn = withdrawals
            .filter(w => w.status === 'approved')
            .reduce((sum, w) => sum + (w.amount || 0), 0);

        const activeInvestmentsSum = investments
            .filter(i => i.status === 'active')
            .reduce((sum, i) => sum + (i.amount || 0), 0);

        const totalProfitClaimed = investments
            .reduce((sum, i) => sum + (i.totalEarned || 0), 0);

        const pendingProfits = investments
            .reduce((sum, i) => sum + (i.pendingProfit || 0), 0);

        res.json({
            success: true,
            user,
            investments,
            deposits,
            withdrawals,
            referrals,
            stats: {
                totalDeposited: parseFloat(totalDeposited.toFixed(2)),
                totalWithdrawn: parseFloat(totalWithdrawn.toFixed(2)),
                activeInvestmentsSum: parseFloat(activeInvestmentsSum.toFixed(2)),
                totalProfitClaimed: parseFloat(totalProfitClaimed.toFixed(2)),
                pendingProfits: parseFloat(pendingProfits.toFixed(2)),
                pendingDepositsCount: deposits.filter(d => d.status === 'pending').length,
                pendingWithdrawalsCount: withdrawals.filter(w => w.status === 'pending').length,
                referralsCount: referrals.length
            }
        });
    } catch (error) {
        console.error('[ADMIN GET USER DETAILS ERROR]', error);
        res.status(500).json({ success: false, message: error.message || 'Server error.' });
    }
};

// ─── UPDATE USER PROFILE ──────────────────────────────────────────────────────
const updateUser = async(req, res) => {
    try {
        const { firstName, lastName, email, phone, phoneCountry, country, role, isVerified, isActive } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        if (email && email.toLowerCase() !== user.email) {
            const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
            if (existing) {
                return res.status(409).json({ success: false, message: 'Email is already used by another user.' });
            }
            user.email = email.toLowerCase().trim();
        }

        if (firstName !== undefined) user.firstName = firstName.trim();
        if (lastName !== undefined) user.lastName = lastName.trim();
        if (phone !== undefined) user.phone = phone.trim();
        if (phoneCountry !== undefined) user.phoneCountry = phoneCountry.trim();
        if (country !== undefined) user.country = country.trim();
        if (isVerified !== undefined) user.isVerified = Boolean(isVerified);
        if (isActive !== undefined) user.isActive = Boolean(isActive);
        if (role !== undefined && ['user', 'admin'].includes(role)) {
            // Cannot demote own account
            if (req.user._id.toString() === user._id.toString() && role !== 'admin') {
                return res.status(400).json({ success: false, message: 'You cannot remove your own admin privileges.' });
            }
            user.role = role;
        }

        await user.save({ validateBeforeSave: false });
        res.json({ success: true, message: 'User updated successfully.', user });
    } catch (error) {
        console.error('[ADMIN UPDATE USER ERROR]', error);
        res.status(500).json({ success: false, message: error.message || 'Server error.' });
    }
};

// ─── RESET USER PASSWORD ──────────────────────────────────────────────────────
const resetUserPassword = async(req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        user.password = newPassword;
        await user.save(); // Triggers pre('save') bcrypt hash

        res.json({ success: true, message: `Password reset successfully for ${user.firstName}.` });
    } catch (error) {
        console.error('[ADMIN RESET PASSWORD ERROR]', error);
        res.status(500).json({ success: false, message: error.message || 'Server error.' });
    }
};

// ─── DELETE USER SAFELY ───────────────────────────────────────────────────────
const deleteUser = async(req, res) => {
    try {
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ success: false, message: 'You cannot delete your own administrator account.' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        if (user.role === 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return res.status(400).json({ success: false, message: 'Cannot delete the only administrator account.' });
            }
        }

        // Clean up or dissociate related user data
        await Promise.all([
            Investment.deleteMany({ user: user._id }),
            Deposit.deleteMany({ user: user._id }),
            Withdrawal.deleteMany({ user: user._id }),
            User.updateMany({ referredBy: user._id }, { $set: { referredBy: null } }),
            User.findByIdAndDelete(user._id)
        ]);

        res.json({ success: true, message: `User ${user.firstName} ${user.lastName} deleted successfully.` });
    } catch (error) {
        console.error('[ADMIN DELETE USER ERROR]', error);
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

// ─── ADMIN: GET ALL PLATFORM INVESTMENTS ──────────────────────────────────────
const getAllInvestments = async(req, res) => {
    try {
        const { page = 1, limit = 50, status, search } = req.query;
        const filter = {};
        if (status && ['active', 'completed', 'cancelled'].includes(status)) {
            filter.status = status;
        }

        if (search && search.trim()) {
            const users = await User.find({
                $or: [
                    { firstName: { $regex: search.trim(), $options: 'i' } },
                    { lastName: { $regex: search.trim(), $options: 'i' } },
                    { email: { $regex: search.trim(), $options: 'i' } }
                ]
            }).select('_id');
            const userIds = users.map(u => u._id);
            filter.$or = [
                { user: { $in: userIds } },
                { plan: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        const investments = await Investment.find(filter)
            .populate('user', 'firstName lastName email balance phone')
            .sort({ createdAt: -1 })
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));

        const total = await Investment.countDocuments(filter);

        const [activeCount, completedCount, cancelledCount, volumeAgg] = await Promise.all([
            Investment.countDocuments({ status: 'active' }),
            Investment.countDocuments({ status: 'completed' }),
            Investment.countDocuments({ status: 'cancelled' }),
            Investment.aggregate([
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
        ]);

        res.json({
            success: true,
            investments,
            total,
            pages: Math.ceil(total / parseInt(limit)),
            stats: {
                activeCount,
                completedCount,
                cancelledCount,
                totalVolume: volumeAgg[0]?.total || 0
            }
        });
    } catch (error) {
        console.error('[ADMIN GET INVESTMENTS ERROR]', error);
        res.status(500).json({ success: false, message: error.message || 'Server error.' });
    }
};

// ─── ADMIN: UPDATE INVESTMENT STATUS ──────────────────────────────────────────
const updateInvestmentStatus = async(req, res) => {
    try {
        const { status, refund } = req.body; // 'active', 'completed', 'cancelled'
        if (!['active', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status.' });
        }

        const investment = await Investment.findById(req.params.id);
        if (!investment) return res.status(404).json({ success: false, message: 'Investment not found.' });

        const prevStatus = investment.status;
        investment.status = status;

        if (status === 'cancelled' && refund && prevStatus !== 'cancelled') {
            await User.findByIdAndUpdate(investment.user, {
                $inc: { balance: investment.amount }
            });
        }

        await investment.save();
        res.json({ 
            success: true, 
            message: `Investment status updated to ${status}.${refund ? ' Principal refunded.' : ''}`, 
            investment 
        });
    } catch (error) {
        console.error('[ADMIN UPDATE INVESTMENT STATUS ERROR]', error);
        res.status(500).json({ success: false, message: error.message || 'Server error.' });
    }
};

module.exports = { 
    getDashboardStats, 
    getAllUsers, 
    getUserDetails,
    updateUser,
    resetUserPassword,
    deleteUser,
    toggleUserStatus, 
    adjustBalance,
    getAllInvestments,
    updateInvestmentStatus
};