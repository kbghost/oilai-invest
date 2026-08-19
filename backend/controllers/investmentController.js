/**
 * ════════════════════════════════════════════════════════════════
 * controllers/investmentController.js
 * ════════════════════════════════════════════════════════════════
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  CE FICHIER CONTIENT TOUTE LA LOGIQUE FINANCIÈRE            ║
 * ║  Modifiez uniquement les sections marquées ← MODIFIER ICI   ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * SECTIONS MODIFIABLES :
 *   1. PLANS                → ROI, montants, durée
 *   2. CLAIM_COOLDOWN_HOURS → délai entre 2 claims
 *   3. getOilVariation()    → amplitude de variation du pétrole
 *   4. getAIMultiplier()    → paliers du multiplicateur IA
 */

const Investment = require('../models/Investment');
const User       = require('../models/User');
const { validationResult } = require('express-validator');

// ══════════════════════════════════════════════════════════════
// 1. PLANS D'INVESTISSEMENT
// ══════════════════════════════════════════════════════════════
//
// dailyROI     : % de gain par jour (ex: 2.5 = 2.5%/jour)
// minAmount    : dépôt minimum en USD
// maxAmount    : dépôt maximum en USD (null = illimité)
// durationDays : durée du plan en jours
//
// EXEMPLES DE MODIFICATION :
//   Doubler le ROI Starter : dailyROI: 1.5 → 3.0
//   Changer la durée       : durationDays: 30 → 60
//   Élargir le min Starter : minAmount: 100 → 50
//
// ⚠️ MODE TEST ACTUEL : durationDays = 3 (3 claims et le plan se termine)
// ⚠️ MODE PROD        : remettre durationDays = 30
// ══════════════════════════════════════════════════════════════
const PLANS = {
  decouverte: {
    name:         'Découverte',
    price:        100,
    dailyROI:     3.0,
    durationDays: 30,
    dailyGain:    3.00,
    totalProfit:  90.00,
    thresholdDays:'17 jours',
    features: [
      'Gain par Jour : 3,00 €',
      'Total Profit Net : 90,00 €',
      'Seuil (50 €) en 17 jours',
      'Gains réclamables chaque 24h',
      'Retrait à tout moment',
    ],
  },
  standard: {
    name:         'Standard',
    price:        250,
    dailyROI:     4.5,
    durationDays: 45,
    dailyGain:    11.25,
    totalProfit:  506.25,
    thresholdDays:'5 jours',
    features: [
      'Gain par Jour : 11,25 €',
      'Total Profit Net : 506,25 €',
      'Seuil (50 €) en 5 jours',
      'Gains réclamables chaque 24h',
      'Support prioritaire',
    ],
  },
  performance: {
    name:         'Performance',
    price:        500,
    dailyROI:     6.0,
    durationDays: 60,
    dailyGain:    30.00,
    totalProfit:  1800.00,
    thresholdDays:'2 jours',
    features: [
      'Gain par Jour : 30,00 €',
      'Total Profit Net : 1 800,00 €',
      'Seuil (50 €) en 2 jours',
      'Retrait express',
      'Alertes marché IA',
    ],
  },
  patrimoine: {
    name:         'Patrimoine',
    price:        1000,
    dailyROI:     8.0,
    durationDays: 90,
    dailyGain:    80.00,
    totalProfit:  7200.00,
    thresholdDays:'1 jour',
    features: [
      'Gain par Jour : 80,00 €',
      'Total Profit Net : 7 200,00 €',
      'Seuil (50 €) en 1 jour',
      'Conseiller dédié',
    ],
  },
  vip_exec: {
    name:         'VIP Exec',
    price:        2500,
    dailyROI:     10.0,
    durationDays: 120,
    dailyGain:    250.00,
    totalProfit:  30000.00,
    thresholdDays:'Chaque jour',
    features: [
      'Gain par Jour : 250,00 €',
      'Total Profit Net : 30 000,00 €',
      'Seuil (50 €) Chaque jour',
      'Retrait express prioritaire',
      'Conseiller VIP dédié',
    ],
  },
  club_prive: {
    name:         'Club Privé',
    price:        5000,
    dailyROI:     12.0,
    durationDays: 180,
    dailyGain:    600.00,
    totalProfit:  108000.00,
    thresholdDays:'Chaque jour',
    features: [
      'Gain par Jour : 600,00 €',
      'Total Profit Net : 108 000,00 €',
      'Seuil (50 €) Chaque jour',
      'Conseiller VIP dédié',
      'Analyses exclusives & Arbitrages',
    ],
  },
};

// ══════════════════════════════════════════════════════════════
// 2. DÉLAI ENTRE DEUX CLAIMS
// ══════════════════════════════════════════════════════════════
// MODE TEST        → 4/60 heures (= 4 minutes)
// MODE PRODUCTION  → 24 heures
//
// Pour repasser en production : commenter la ligne TEST,
// décommenter la ligne PROD
// ══════════════════════════════════════════════════════════════
const CLAIM_COOLDOWN_HOURS = 24;    // ← PROD : 24 heures

// ══════════════════════════════════════════════════════════════
// 3. ALGORITHME DE CALCUL DU GAIN
// ══════════════════════════════════════════════════════════════
//
// FORMULE :
//   profit_brut  = montant × (dailyROI / 100)
//   profit_final = profit_brut × multiplicateur_IA
//
// Le multiplicateur IA simule l'impact du prix du pétrole.
// Variation générée aléatoirement entre -4% et +4%.
//
// DÉSACTIVER le multiplicateur → remplacer getAIMultiplier par () => 1.0
// CHANGER l'amplitude → modifier le × 8 dans getOilVariation
//   × 4 = variation ±2% (plus stable)
//   × 8 = variation ±4% (actuel)
//   × 12 = variation ±6% (plus volatile)
// ══════════════════════════════════════════════════════════════
function getOilVariation() {
  return parseFloat(((Math.random() - 0.5) * 8).toFixed(2)); // ← MODIFIER : × 8 = ±4%
}

function getAIMultiplier(variation) {
  // L'impact du pétrole sur les gains est désormais désactivé
  return 1.00;
}

function calculateDailyProfit(amount, dailyROI, variation) {
  const base       = parseFloat((amount * dailyROI / 100).toFixed(4));
  const multiplier = getAIMultiplier(variation);
  return parseFloat((base * multiplier).toFixed(2));
}

// ══════════════════════════════════════════════════════════════
// GET PLANS — retourne la config des plans au frontend
// ══════════════════════════════════════════════════════════════
const getPlans = (req, res) => {
  res.json({ success: true, plans: PLANS });
};

// ══════════════════════════════════════════════════════════════
// CREATE INVESTMENT
// ══════════════════════════════════════════════════════════════
const createInvestment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { plan } = req.body;
    const planConfig = PLANS[plan];
    if (!planConfig) {
      return res.status(400).json({ success: false, message: 'Invalid plan.' });
    }

    const amt = planConfig.price;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.balance < amt) {
      return res.status(400).json({ success: false, message: `Insufficient balance. Current balance: $${user.balance.toFixed(2)}` });
    }

    // Calculer le 1er profit immédiatement disponible
    const variation   = getOilVariation();
    const firstProfit = calculateDailyProfit(amt, planConfig.dailyROI, variation);

    const investment = await Investment.create({
      user:           req.user._id,
      plan,
      amount:         amt,
      dailyROI:       planConfig.dailyROI,
      durationDays:   planConfig.durationDays,
      pendingProfit:  firstProfit,   // disponible immédiatement pour le 1er claim
      nextClaimAt:    new Date(),    // Disponible immédiatement
      lastProfitDate: new Date(),
      status:         'active',
    });

    // Déduire le montant du solde
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { balance: -amt, totalInvested: amt },
    });

    res.status(201).json({
      success: true,
      message: `${planConfig.name} plan activated! First profit of $${firstProfit} already available.`,
      investment,
      firstProfit,
    });
  } catch (err) {
    console.error('[INVEST] Create error:', err);
    res.status(500).json({ success: false, message: 'Error creating investment.' });
  }
};

// ══════════════════════════════════════════════════════════════
// CLAIM PROFIT — bouton "Réclamer mes gains"
// ══════════════════════════════════════════════════════════════
const claimProfit = async (req, res) => {
  try {
    const investment = await Investment.findOne({
      _id:  req.params.id,
      user: req.user._id,
    });

    if (!investment) {
      return res.status(404).json({ success: false, message: 'Investment not found.' });
    }
    if (investment.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This investment is no longer active.' });
    }

    // ── Vérification du cooldown ─────────────────────────────────────────
    if (investment.nextClaimAt && new Date(investment.nextClaimAt).getTime() > Date.now()) {
      const msLeft      = new Date(investment.nextClaimAt).getTime() - Date.now();
      const minsLeft    = Math.ceil(msLeft / 60000);
      const hoursLeft   = Math.floor(msLeft / 3600000);
      const minutesLeft = Math.ceil((msLeft % 3600000) / 60000);

      return res.status(429).json({
        success:     false,
        message:     hoursLeft > 0
          ? `Next claim in ${hoursLeft}h ${minutesLeft}min.`
          : `Next claim in ${minsLeft} min.`,
        nextClaimAt: investment.nextClaimAt,
        hoursLeft,
        minutesLeft,
        msLeft,
      });
    }

    // ── Vérification que des gains sont disponibles ──────────────────────
    if (!investment.pendingProfit || investment.pendingProfit <= 0) {
      // Générer un profit si le cron n'a pas encore tourné
      const variation = getOilVariation();
      investment.pendingProfit = calculateDailyProfit(investment.amount, investment.dailyROI, variation);

      if (investment.pendingProfit <= 0) {
        return res.status(400).json({ success: false, message: 'No profits available at the moment.' });
      }
    }

    const profitToClaim = parseFloat(investment.pendingProfit.toFixed(2));
    const now           = new Date();

    // ── Calculer le prochain profit (pour demain / prochain cycle) ───────
    const nextVariation = getOilVariation();
    const nextProfit    = calculateDailyProfit(investment.amount, investment.dailyROI, nextVariation);

    // ── Mise à jour de l'investissement ──────────────────────────────────
    investment.profitHistory.push({
      date:      now,
      profit:    profitToClaim,
      claimedAt: now,
    });
    investment.totalEarned   = parseFloat((investment.totalEarned + profitToClaim).toFixed(2));
    investment.daysCompleted += 1;
    investment.lastClaimDate  = now;
    investment.lastProfitDate = now;

    const nextClaimAt = new Date(now.getTime() + CLAIM_COOLDOWN_HOURS * 3600000);
    investment.nextClaimAt = nextClaimAt;

    // ── Vérifier si le plan est terminé ──────────────────────────────────
    const isComplete = investment.daysCompleted >= investment.durationDays;

    if (isComplete) {
      investment.status        = 'completed';
      investment.pendingProfit = 0;

      // Rembourser le capital + profit final en une seule opération
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { balance: investment.amount + profitToClaim, totalEarnings: profitToClaim },
      });

      await investment.save();

      return res.json({
        success:      true,
        completed:    true,
        message:      `🎉 Plan completed! $${profitToClaim.toFixed(2)} in earnings + $${investment.amount.toFixed(2)} capital returned to your balance.`,
        profitClaimed: profitToClaim,
        capitalReturned: investment.amount,
        nextProfit:   0,
        investment,
      });
    }

    // ── Plan non terminé : mettre à jour pendingProfit pour demain ───────
    investment.pendingProfit = nextProfit;
    await investment.save();

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { balance: profitToClaim, totalEarnings: profitToClaim },
    });

    return res.json({
      success:       true,
      completed:     false,
      message:       `✅ $${profitToClaim.toFixed(2)} credited to your balance!`,
      profitClaimed: profitToClaim,
      nextProfit,
      nextClaimAt,
      daysLeft:      investment.durationDays - investment.daysCompleted,
      investment,
    });

  } catch (err) {
    console.error('[INVEST] Claim error:', err);
    res.status(500).json({ success: false, message: 'Error claiming profits.' });
  }
};

// ══════════════════════════════════════════════════════════════
// GET USER INVESTMENTS
// ══════════════════════════════════════════════════════════════
const getUserInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, investments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ══════════════════════════════════════════════════════════════
// ADMIN : GÉNÉRER LES PROFITS MANUELLEMENT
// (aussi appelé par le cron job)
// ══════════════════════════════════════════════════════════════
const processDailyProfits = async (req = null, res = null) => {
  const active = await Investment.find({ status: 'active' });
  let count = 0;
  let totalGenerated = 0;

  for (const inv of active) {
    try {
      const variation = getOilVariation();
      const profit    = calculateDailyProfit(inv.amount, inv.dailyROI, variation);

      inv.pendingProfit  = parseFloat(((inv.pendingProfit || 0) + profit).toFixed(2));
      inv.lastProfitDate = new Date();
      await inv.save();

      count++;
      totalGenerated += profit;
    } catch (err) {
      console.error(`[CRON] Erreur investissement ${inv._id}:`, err.message);
    }
  }

  const msg = `${count} investment(s) processed. $${totalGenerated.toFixed(2)} generated pending claim.`;
  console.log('[CRON]', msg);

  if (res) res.json({ success: true, message: msg, processed: count, totalGenerated });
  return { count, totalGenerated };
};

module.exports = { getPlans, createInvestment, claimProfit, getUserInvestments, processDailyProfits, PLANS, CLAIM_COOLDOWN_HOURS };
