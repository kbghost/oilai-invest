/**
 * ════════════════════════════════════════════════════════════════
 * models/User.js
 * ════════════════════════════════════════════════════════════════
 *
 * CHAMPS DE PARRAINAGE :
 *   referralCode     : code unique auto-généré (OILAI-XXXXXX)
 *   referredBy       : ID du parrain (null si inscription directe)
 *   referralEarnings : cumul des bonus reçus grâce aux filleuls
 *   referralCount    : nombre de filleuls inscrits
 *
 * MODIFIER LE FORMAT DU CODE :
 *   Chercher 'OILAI-' dans le pre('validate') ci-dessous
 *   Changer le préfixe ou la longueur (randomBytes(3) = 6 chars hex)
 */
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const crypto   = require('crypto');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true,'Prénom requis'], trim: true, minlength: 2, maxlength: 50 },
  lastName:  { type: String, required: [true,'Nom requis'],    trim: true, minlength: 2, maxlength: 50 },
  email:     { type: String, required: [true,'Email requis'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/,'Email invalide'] },
  password:  { type: String, required: [true,'Mot de passe requis'], minlength: 6, select: false },
  phone:        { type: String, trim: true, default: '' },
  phoneCountry: { type: String, trim: true, default: '' },
  country:      { type: String, trim: true, default: '' },

  // ── Finances ──────────────────────────────────────────────────────────────
  balance:       { type: Number, default: 0, min: 0 },
  totalInvested: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },

  // ── Parrainage ────────────────────────────────────────────────────────────
  referralCode:     { type: String, unique: true, sparse: true },
  referredBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referralEarnings: { type: Number, default: 0 },
  referralCount:    { type: Number, default: 0 },

  // ── Compte ────────────────────────────────────────────────────────────────
  role:       { type: String, enum: ['user','admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  isActive:   { type: Boolean, default: true },
  lastLogin:  { type: Date },
}, { timestamps: true });

// ── Auto-génération du code de parrainage ─────────────────────────────────────
userSchema.pre('validate', function(next) {
  if (!this.referralCode) {
    // Format : OILAI-XXXXXX (6 caractères hexadécimaux en majuscules)
    // Pour changer le préfixe : remplacer 'OILAI-' par autre chose
    // Pour changer la longueur : randomBytes(3)=6chars, (4)=8chars, (5)=10chars
    this.referralCode = 'OILAI-' + crypto.randomBytes(3).toString('hex').toUpperCase();
  }
  next();
});

// ── Hash du mot de passe ──────────────────────────────────────────────────────
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Comparaison du mot de passe ───────────────────────────────────────────────
userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => { delete ret.password; delete ret.__v; return ret; },
});

module.exports = mongoose.model('User', userSchema);
