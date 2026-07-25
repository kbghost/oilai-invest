/**
 * ═══════════════════════════════════════════════════════════════
 * services/cronJobs.js — Génération automatique des gains
 * ═══════════════════════════════════════════════════════════════
 *
 * COMMENT ÇA MARCHE :
 *   Chaque nuit à 00h05 UTC, le cron génère un nouveau "pendingProfit"
 *   pour chaque investissement actif. L'utilisateur doit ensuite cliquer
 *   sur "Réclamer mes gains" dans son dashboard pour les encaisser.
 *
 * MODIFIER L'HEURE D'EXÉCUTION :
 *   Changer l'expression cron ligne ~80 : '5 0 * * *'
 *   Format : 'minute heure jour mois jour-semaine'
 *   Exemples :
 *     '5 0 * * *'   → 00h05 UTC chaque jour (défaut)
 *     '0 8 * * *'   → 08h00 UTC chaque jour
 *     '*\/5 * * * *' → toutes les 5 minutes (pour tester)
 *
 * MODIFIER LE CALCUL DES GAINS :
 *   Voir controllers/investmentController.js → calculateDailyProfit()
 */

const cron       = require('node-cron');
const Investment = require('../models/Investment');

// ─── Simulation du prix pétrole ───────────────────────────────────────────────
function getOilVariation() {
  return parseFloat(((Math.random() - 0.5) * 8).toFixed(2));
}

function getAIMultiplier(variation) {
  if (variation > 2)  return 1.20;
  if (variation > 0)  return 1.10;
  if (variation > -1) return 1.00;
  if (variation > -2) return 0.90;
  return 0.85;
}

// ─── Génération des profits en attente ───────────────────────────────────────
async function generateDailyProfits() {
  const start = Date.now();
  console.log(`[CRON] ⚙️  Génération des profits — ${new Date().toISOString()}`);

  try {
    const active = await Investment.find({ status: 'active' });
    if (!active.length) { console.log('[CRON] Aucun investissement actif.'); return; }

    let count = 0;
    for (const inv of active) {
      try {
        /* 
         * DÉSACTIVÉ : L'algorithme de claim pré-remplit déjà `pendingProfit` 
         * pour la prochaine réclamation. Si on laisse le cron ajouter du profit,
         * l'utilisateur gagne le double. On commente donc cette partie.
         * 
         const variation   = getOilVariation();
         const multiplier  = getAIMultiplier(variation);
         const dailyProfit = parseFloat((inv.amount * inv.dailyROI / 100 * multiplier).toFixed(2));
         inv.pendingProfit   = parseFloat(((inv.pendingProfit || 0) + dailyProfit).toFixed(2));
         inv.lastProfitDate  = new Date();
         await inv.save();
         */
        count++;
      } catch (err) {
        console.error(`[CRON] Erreur investissement ${inv._id}:`, err.message);
      }
    }

    console.log(`[CRON] ✅ ${count} profits vérifiés en ${((Date.now()-start)/1000).toFixed(1)}s`);
  } catch (err) {
    console.error('[CRON] ❌ Erreur fatale:', err);
  }
}

// ─── Démarrage du cron ───────────────────────────────────────────────────────
function startCronJobs() {
  // Génère les profits chaque nuit à 00h05 UTC
  // ↓ MODIFIER L'HEURE ICI ↓
  // ── MODE TEST : toutes les 4 minutes ──────────────────────────────────────
  // Pour repasser en production : commenter la ligne TEST et décommenter PROD
  cron.schedule('*/4 * * * *', generateDailyProfits);              // ← TEST : /4min
  // cron.schedule('5 0 * * *', generateDailyProfits, { timezone: 'UTC' }); // ← PROD
  console.log('[CRON] 🕐 MODE TEST — génération profits toutes les 4 minutes');
}

module.exports = { startCronJobs, generateDailyProfits };
