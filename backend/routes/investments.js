const express = require('express');
const { body } = require('express-validator');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getPlans, createInvestment, claimProfit,
  getUserInvestments, processDailyProfits
} = require('../controllers/investmentController');

const router = express.Router();

// Plans disponibles (public)
router.get('/plans', getPlans);

// Investissements utilisateur
router.get('/',           protect, getUserInvestments);
router.post('/',          protect, [
  body('plan').isIn(['starter','pro','premium']),
  body('amount').isNumeric().isFloat({ min: 1 }),
], createInvestment);

// ── CLAIM : réclamer les gains du jour ────────────────────────────────────────
// POST /api/investments/:id/claim
router.post('/:id/claim', protect, claimProfit);

// Admin : générer profits manuellement
router.post('/process-profits', protect, adminOnly, (req, res) => processDailyProfits(req, res));

module.exports = router;
