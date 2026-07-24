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
  starter: {
    name:         'Starter',
    minAmount:    100,
    maxAmount:    999,
    dailyROI:     1.5,       // ← MODIFIER : % gain/jour
    durationDays: 3,         // ← TEST=3 | PROD=30
    features: [
      'Gains réclamables chaque 4 min (test)',
      'Profits calculés par IA pétrolière',
      'Retrait à tout moment',
      'Support email',
    ],
  },
  pro: {
    name:         'Pro',
    minAmount:    1000,
    maxAmount:    4999,
    dailyROI:     2.5,       // ← MODIFIER
    durationDays: 3,         // ← TEST=3 | PROD=30
    features: [
      'Gains réclamables chaque 4 min (test)',
      'Profits optimisés par IA',
      'Priorité de retrait',
      'Support prioritaire',
      'Alertes marché en temps réel',
    ],
  },
  premium: {
    name:         'Premium',
    minAmount:    5000,
    maxAmount:    null,
    dailyROI:     3.5,       // ← MODIFIER
    durationDays: 3,         // ← TEST=3 | PROD=30
    features: [
      'Gains réclamables chaque 4 min (test)',
      'ROI maximum garanti',
      'Retrait express prioritaire',
      'Conseiller VIP dédié',
      'Analyses de marché exclusives',
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
const CLAIM_COOLDOWN_HOURS = 4 / 60;   // ← TEST : 4 minutes
// const CLAIM_COOLDOWN_HOURS = 24;    // ← PROD : 24 heures

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
  // ← MODIFIER les paliers et multiplicateurs selon votre logique
  if (variation >  2.0) return 1.20;  // marché très haussier  → +20%
  if (variation >  0.0) return 1.10;  // marché haussier       → +10%
  if (variation > -1.0) return 1.00;  // marché neutre         → ±0%
  if (variation > -2.0) return 0.92;  // marché baissier       → -8%
  return 0.85;                         // marché très baissier  → -15%
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

    const { plan, amount } = req.body;
    const planConfig = PLANS[plan];
    if (!planConfig) {
      return res.status(400).json({ success: false, message: 'Plan invalide.' });
    }

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < planConfig.minAmount) {
      return res.status(400).json({ success: false, message: `Montant minimum : $${planConfig.minAmount}` });
    }
    if (planConfig.maxAmount && amt > planConfig.maxAmount) {
      return res.status(400).json({ success: false, message: `Montant maximum : $${planConfig.maxAmount}` });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    if (user.balance < amt) {
      return res.status(400).json({ success: false, message: `Solde insuffisant. Solde actuel : $${user.balance.toFixed(2)}` });
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
      lastProfitDate: new Date(),
      status:         'active',
    });

    // Déduire le montant du solde
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { balance: -amt, totalInvested: amt },
    });

    res.status(201).json({
      success: true,
      message: `Plan ${planConfig.name} créé ! Premier gain de $${firstProfit} déjà disponible.`,
      investment,
      firstProfit,
    });
  } catch (err) {
    console.error('[INVEST] Create error:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de la création.' });
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
      return res.status(404).json({ success: false, message: 'Investissement introuvable.' });
    }
    if (investment.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Cet investissement n\'est plus actif.' });
    }

    // ── Vérification du cooldown ─────────────────────────────────────────
    if (investment.lastClaimDate) {
      const msSinceClaim   = Date.now() - new Date(investment.lastClaimDate).getTime();
      const hoursSinceClaim = msSinceClaim / (1000 * 60 * 60);

      if (hoursSinceClaim < CLAIM_COOLDOWN_HOURS) {
        const msLeft      = (CLAIM_COOLDOWN_HOURS * 3600000) - msSinceClaim;
        const minsLeft    = Math.ceil(msLeft / 60000);
        const hoursLeft   = Math.floor(msLeft / 3600000);
        const minutesLeft = Math.ceil((msLeft % 3600000) / 60000);

        return res.status(429).json({
          success:     false,
          message:     hoursLeft > 0
            ? `Prochain claim dans ${hoursLeft}h ${minutesLeft}min.`
            : `Prochain claim dans ${minsLeft} min.`,
          nextClaimAt: new Date(new Date(investment.lastClaimDate).getTime() + CLAIM_COOLDOWN_HOURS * 3600000),
          hoursLeft,
          minutesLeft,
          msLeft,
        });
      }
    }

    // ── Vérification que des gains sont disponibles ──────────────────────
    if (!investment.pendingProfit || investment.pendingProfit <= 0) {
      // Générer un profit si le cron n'a pas encore tourné
      const variation = getOilVariation();
      investment.pendingProfit = calculateDailyProfit(investment.amount, investment.dailyROI, variation);

      if (investment.pendingProfit <= 0) {
        return res.status(400).json({ success: false, message: 'Aucun gain disponible pour le moment.' });
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
        message:      `🎉 Plan terminé ! $${profitToClaim.toFixed(2)} de gains + $${investment.amount.toFixed(2)} de capital remboursés sur votre solde.`,
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
      message:       `✅ $${profitToClaim.toFixed(2)} crédités sur votre solde !`,
      profitClaimed: profitToClaim,
      nextProfit,
      nextClaimAt,
      daysLeft:      investment.durationDays - investment.daysCompleted,
      investment,
    });

  } catch (err) {
    console.error('[INVEST] Claim error:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de la réclamation.' });
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
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ══════════════════════════════════════════════════════════════
// ADMIN : GÉNÉRER LES PROFITS MANUELLEMENT
// (aussi appelé par le cron job)
// ══════════════════════════════════════════════════════════════
const processDailyProfits = async (res = null) => {
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

  const msg = `${count} investissement(s) traité(s). $${totalGenerated.toFixed(2)} générés en attente de claim.`;
  console.log('[CRON]', msg);

  if (res) res.json({ success: true, message: msg, processed: count, totalGenerated });
  return { count, totalGenerated };
};

module.exports = { getPlans, createInvestment, claimProfit, getUserInvestments, processDailyProfits, PLANS, CLAIM_COOLDOWN_HOURS };
