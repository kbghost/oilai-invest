/**
 * ════════════════════════════════════════════════════════════════
 * controllers/depositController.js
 * ════════════════════════════════════════════════════════════════
 *
 * BONUS PARRAINAGE :
 *   Déclenché automatiquement lors de l'approbation du 1er dépôt d'un filleul
 *   Formule : bonus = montant × REFERRAL_BONUS_PERCENT / 100
 *   Condition : uniquement le PREMIER dépôt approuvé du filleul
 *
 * MODIFIER LE BONUS → authController.js → REFERRAL_BONUS_PERCENT
 *
 * MÉTHODES CRYPTO ACCEPTÉES :
 *   Modifier le tableau enum dans models/Deposit.js si besoin d'ajouter une crypto
 */
const { validationResult } = require('express-validator');
const Deposit = require('../models/Deposit');
const User    = require('../models/User');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { REFERRAL_BONUS_PERCENT } = require('./authController');

// ── Multer — stockage des preuves de dépôt ───────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/proofs';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `proof-${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Format non accepté. Utilisez JPG, PNG ou WebP.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
});

// ── CRÉER UN DÉPÔT ────────────────────────────────────────────────────────────
const createDeposit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { amount, method, reference } = req.body;
    const deposit = await Deposit.create({
      user:       req.user._id,
      amount:     parseFloat(amount),
      method,
      reference:  reference || '',
      proofImage: req.file ? req.file.path : null,
      status:     'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Dépôt soumis avec succès. En attente de validation.',
      deposit,
    });
  } catch (err) {
    console.error('[DEPOSIT] Create error:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de la soumission du dépôt.' });
  }
};

// ── DÉPÔTS DE L'UTILISATEUR ───────────────────────────────────────────────────
const getUserDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, deposits });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── ADMIN : TOUS LES DÉPÔTS ───────────────────────────────────────────────────
const getAllDeposits = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const deposits = await Deposit.find(filter)
      .populate('user', 'firstName lastName email referredBy referralCode')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Deposit.countDocuments(filter);
    res.json({ success: true, deposits, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── ADMIN : APPROUVER UN DÉPÔT ────────────────────────────────────────────────
// C'est ici que le bonus parrainage est déclenché
const approveDeposit = async (req, res) => {
  try {
    // Charger le dépôt avec l'utilisateur complet (IMPORTANT : populate referredBy)
    const deposit = await Deposit.findById(req.params.id);
    if (!deposit) {
      return res.status(404).json({ success: false, message: 'Dépôt introuvable.' });
    }
    if (deposit.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Ce dépôt a déjà été traité.' });
    }

    // Mettre à jour le statut
    deposit.status      = 'approved';
    deposit.processedBy = req.user._id;
    deposit.processedAt = new Date();
    deposit.adminNote   = req.body.note || null;
    await deposit.save();

    // Créditer le solde de l'utilisateur
    await User.findByIdAndUpdate(deposit.user, {
      $inc: { balance: deposit.amount },
    });

    // ── BONUS PARRAINAGE ──────────────────────────────────────────────────────
    // Charger l'utilisateur avec son champ referredBy
    const user = await User.findById(deposit.user).select('referredBy firstName');

    if (user && user.referredBy) {
      // Compter ses dépôts approuvés AVANT celui-ci
      const previousApproved = await Deposit.countDocuments({
        user:   deposit.user,
        status: 'approved',
        _id:    { $ne: deposit._id }, // exclure le dépôt actuel
      });

      // Bonus uniquement sur le PREMIER dépôt approuvé
      if (previousApproved === 0) {
        const bonus = parseFloat((deposit.amount * REFERRAL_BONUS_PERCENT / 100).toFixed(2));

        await User.findByIdAndUpdate(user.referredBy, {
          $inc: { balance: bonus, referralEarnings: bonus },
        });

        console.log(
          `[REFERRAL] ✅ Bonus $${bonus} (${REFERRAL_BONUS_PERCENT}% de $${deposit.amount}) ` +
          `crédité au parrain (ID: ${user.referredBy}) ` +
          `pour le filleul ${user.firstName} (ID: ${deposit.user})`
        );
      }
    }

    res.json({
      success: true,
      message: `Dépôt de $${deposit.amount} approuvé. Solde crédité.`,
      deposit,
    });
  } catch (err) {
    console.error('[DEPOSIT] Approve error:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'approbation.' });
  }
};

// ── ADMIN : REJETER UN DÉPÔT ──────────────────────────────────────────────────
const rejectDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);
    if (!deposit) return res.status(404).json({ success: false, message: 'Dépôt introuvable.' });
    if (deposit.status !== 'pending') return res.status(400).json({ success: false, message: 'Déjà traité.' });

    deposit.status      = 'rejected';
    deposit.processedBy = req.user._id;
    deposit.processedAt = new Date();
    deposit.adminNote   = req.body.note || 'Rejeté par l\'administrateur';
    await deposit.save();

    res.json({ success: true, message: 'Dépôt rejeté.', deposit });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

module.exports = { upload, createDeposit, getUserDeposits, getAllDeposits, approveDeposit, rejectDeposit };
