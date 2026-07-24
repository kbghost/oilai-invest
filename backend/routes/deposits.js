const express = require('express');
const { body } = require('express-validator');
const { protect, adminOnly } = require('../middleware/auth');
const {
  upload, createDeposit, getUserDeposits,
  getAllDeposits, approveDeposit, rejectDeposit
} = require('../controllers/depositController');

const router = express.Router();

const depositValidation = [
  body('amount').isFloat({ min: 10 }).withMessage('Minimum deposit is $10'),
  body('method').isIn(['bitcoin', 'ethereum', 'usdt', 'bnb']).withMessage('Invalid payment method')
];

router.post('/', protect, upload.single('proofImage'), depositValidation, createDeposit);
router.get('/', protect, getUserDeposits);
router.get('/all', protect, adminOnly, getAllDeposits);
router.patch('/:id/approve', protect, adminOnly, approveDeposit);
router.patch('/:id/reject', protect, adminOnly, rejectDeposit);

module.exports = router;
