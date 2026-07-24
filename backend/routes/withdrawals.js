// routes/withdrawals.js
const express = require('express');
const { body } = require('express-validator');
const { protect, adminOnly } = require('../middleware/auth');
const {
  createWithdrawal, getUserWithdrawals,
  getAllWithdrawals, approveWithdrawal, rejectWithdrawal
} = require('../controllers/withdrawalController');

const router = express.Router();

const withdrawalValidation = [
  body('amount').isFloat({ min: 20 }).withMessage('Minimum withdrawal is $20'),
  body('method').isIn(['bitcoin', 'ethereum', 'usdt', 'bnb']).withMessage('Invalid method'),
  body('walletAddress').notEmpty().withMessage('Wallet address is required')
];

router.post('/', protect, withdrawalValidation, createWithdrawal);
router.get('/', protect, getUserWithdrawals);
router.get('/all', protect, adminOnly, getAllWithdrawals);
router.patch('/:id/approve', protect, adminOnly, approveWithdrawal);
router.patch('/:id/reject', protect, adminOnly, rejectWithdrawal);

module.exports = router;
