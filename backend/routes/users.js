/**
 * routes/users.js
 *
 * ENDPOINTS (tous protégés par JWT) :
 *   GET   /api/users/profile   → profil utilisateur
 *   PATCH /api/users/profile   → modifier profil
 *   GET   /api/users/referral  → stats parrainage + liste filleuls
 */
const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// ── GET /api/users/profile ────────────────────────────────────────────────────
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    res.json({ success: true, user });
  } catch {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ── PATCH /api/users/profile ──────────────────────────────────────────────────
router.patch('/profile', protect, async (req, res) => {
  try {
    // Seuls ces champs sont modifiables
    const allowed = ['firstName', 'lastName', 'phone', 'country'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profil mis à jour.', user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour.' });
  }
});

// ── GET /api/users/referral ───────────────────────────────────────────────────
// Retourne le code, les stats et la liste des filleuls
router.get('/referral', protect, async (req, res) => {
  try {
    // Données du parrain connecté
    const me = await User.findById(req.user._id)
      .select('referralCode referralCount referralEarnings');

    if (!me) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });

    // Liste des filleuls (personnes qui ont mis notre code à l'inscription)
    const filleuls = await User.find({ referredBy: req.user._id })
      .select('firstName lastName createdAt totalInvested balance')
      .sort({ createdAt: -1 });

    res.json({
      success:          true,
      referralCode:     me.referralCode,
      referralCount:    me.referralCount,
      referralEarnings: me.referralEarnings,
      filleuls,
    });
  } catch (err) {
    console.error('[USERS] Referral stats error:', err);
    res.status(500).json({ success: false, message: 'Erreur lors du chargement du parrainage.' });
  }
});

module.exports = router;
