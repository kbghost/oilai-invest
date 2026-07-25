/**
 * ═══════════════════════════════════════════════════════════════
 * models/Investment.js
 * ═══════════════════════════════════════════════════════════════
 *
 * MODIFIER LES PLANS D'INVESTISSEMENT :
 * ─────────────────────────────────────
 * Les plans sont définis dans investmentController.js → constante PLANS
 * Chaque plan a :
 *   - minAmount    : Dépôt minimum en USD
 *   - maxAmount    : Dépôt maximum en USD (null = illimité)
 *   - dailyROI     : % de gain PAR JOUR (ex: 1.5 = 1.5%/jour)
 *   - durationDays : Durée du plan en jours
 *
 * MODIFIER LE CALCUL DES GAINS :
 * ───────────────────────────────
 * Voir investmentController.js → fonction calculateDailyProfit()
 * Formule actuelle : profit = montant × (dailyROI / 100) × multiplicateur_IA
 * Le multiplicateur IA varie entre 0.85 et 1.2 selon le prix du pétrole.
 *
 * MODIFIER LE DÉLAI DU BOUTON CLAIM :
 * ─────────────────────────────────────
 * Chercher CLAIM_COOLDOWN_HOURS dans investmentController.js
 * Par défaut : 24 heures
 */
const mongoose = require('mongoose');

const profitHistorySchema = new mongoose.Schema({
  date:         { type: Date, default: Date.now },
  profit:       { type: Number, required: true },
  oilPrice:     { type: Number },
  oilVariation: { type: Number },
  claimedAt:    { type: Date },  // quand l'utilisateur a cliqué sur "Réclamer"
}, { _id: false });

const investmentSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan:          { type: String, enum: ['starter', 'pro', 'premium'], required: true },
  amount:        { type: Number, required: true, min: 1 },
  dailyROI:      { type: Number, required: true },   // % par jour (ex: 1.5)
  durationDays:  { type: Number, required: true },   // durée totale en jours
  daysCompleted: { type: Number, default: 0 },       // jours écoulés
  totalEarned:   { type: Number, default: 0 },       // total des gains réclamés
  status:        { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  profitHistory: [profitHistorySchema],

  // ── Système de claim ─────────────────────────────────────────────────────
  lastClaimDate:     { type: Date, default: null },    // dernière réclamation
  nextClaimAt:       { type: Date, default: null },    // date de la prochaine réclamation possible
  pendingProfit:     { type: Number, default: 0 },     // gains en attente (non réclamés)
  lastProfitDate:    { type: Date, default: null },    // dernière génération (cron)
  lastProfitGenDate: { type: Date, default: null },    // alias pour le cron

  startDate: { type: Date, default: Date.now },
  endDate:   { type: Date },
}, { timestamps: true });

investmentSchema.pre('save', function(next) {
  if (!this.endDate && this.startDate && this.durationDays) {
    this.endDate = new Date(this.startDate.getTime() + this.durationDays * 24*60*60*1000);
  }
  next();
});

module.exports = mongoose.model('Investment', investmentSchema);
