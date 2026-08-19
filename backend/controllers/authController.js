/**
 * ════════════════════════════════════════════════════════════════
 * controllers/authController.js
 * ════════════════════════════════════════════════════════════════
 *
 * MODIFIER LE BONUS DE PARRAINAGE :
 *   Changer REFERRAL_BONUS_PERCENT (défaut : 5%)
 *   Ce bonus est crédité au parrain lors du 1er dépôt approuvé du filleul
 *   Le calcul : bonus = montant_depot × REFERRAL_BONUS_PERCENT / 100
 *   Exemple : filleul dépose $1000 → parrain reçoit $50
 */
const jwt  = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// ═══════════════════════════════════════════════════════════════
// ⚙️  BONUS PARRAINAGE — modifier ici
// ═══════════════════════════════════════════════════════════════
const REFERRAL_BONUS_PERCENT = 5; // ← MODIFIER (ex: 10 pour 10%)

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const { parsePhoneNumberFromString } = require('libphonenumber-js/max');

// ── Objet user sécurisé renvoyé au client ─────────────────────────────────────
// IMPORTANT : referralCode DOIT être inclus pour que la page Parrainage fonctionne
const safeUser = (user) => ({
  id:               user._id,
  _id:              user._id,
  firstName:        user.firstName,
  lastName:         user.lastName,
  email:            user.email,
  phone:            user.phone,
  phoneCountry:     user.phoneCountry,
  country:          user.country,
  role:             user.role,
  balance:          user.balance,
  totalInvested:    user.totalInvested,
  totalEarnings:    user.totalEarnings,
  isVerified:       user.isVerified,
  isActive:         user.isActive,
  referralCode:     user.referralCode,     // ← CRITIQUE : sans ça la page Parrainage est vide
  referralEarnings: user.referralEarnings,
  referralCount:    user.referralCount,
  referredBy:       user.referredBy,
  createdAt:        user.createdAt,
});

// ── REGISTER ──────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { firstName, lastName, email, password, phone, phoneCountry, country, referralCode } = req.body;

    // Verify unique email
    if (await User.findOne({ email })) {
      return res.status(409).json({ success: false, message: 'This email is already in use.' });
    }

    // Normalize phone number to E.164 format (best effort — never blocks registration)
    let formattedPhone = phone ? phone.trim() : '';
    let isoCountry = phoneCountry || '';

    if (formattedPhone) {
      try {
        const clean = formattedPhone;
        const parsed = clean.startsWith('+')
          ? parsePhoneNumberFromString(clean)
          : parsePhoneNumberFromString(clean, isoCountry || undefined);

        if (parsed && (parsed.isValid() || parsed.isPossible())) {
          formattedPhone = parsed.format('E.164');
          if (parsed.country) isoCountry = parsed.country;
        } else if (!clean.startsWith('+') && isoCountry) {
          // Try prepending the country dial code as a last resort
          const dialCodes = { BJ:'+229',FR:'+33',US:'+1',GB:'+44',DE:'+49',NG:'+234',SN:'+221',CI:'+225',GH:'+233',CM:'+237',TG:'+228',BF:'+226',ML:'+223',NE:'+227',GN:'+224',CD:'+243',CG:'+242',GA:'+241',MA:'+212',DZ:'+213',TN:'+216',EG:'+20',ZA:'+27',KE:'+254',TZ:'+255',UG:'+256',RW:'+250',ET:'+251',MZ:'+258',ZM:'+260',ZW:'+263',MG:'+261',MU:'+230',SC:'+248',SD:'+249' };
          const prefix = dialCodes[isoCountry];
          if (prefix) {
            const withPrefix = `${prefix}${clean.replace(/\D/g,'').replace(/^0+/,'')}`;
            const reparsed = parsePhoneNumberFromString(withPrefix);
            if (reparsed && (reparsed.isValid() || reparsed.isPossible())) {
              formattedPhone = reparsed.format('E.164');
              if (reparsed.country) isoCountry = reparsed.country;
            }
          }
        }
      } catch (err) {
        // Keep original value — do not block registration
      }
    }

    // Vérifier le code de parrainage si fourni
    let referrer = null;
    if (referralCode && referralCode.trim()) {
      const code = referralCode.trim().toUpperCase();
      referrer = await User.findOne({ referralCode: code });
      if (!referrer) {
        return res.status(400).json({ success: false, message: 'Invalid referral code.' });
      }
    }

    // Créer l'utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone:        formattedPhone,
      phoneCountry: isoCountry,
      country:      country || '',
      referredBy:   referrer ? referrer._id : null,
    });

    // Incrémenter le compteur de filleuls du parrain
    if (referrer) {
      await User.findByIdAndUpdate(referrer._id, { $inc: { referralCount: 1 } });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: referrer
        ? `Account created! You were referred by ${referrer.firstName}.`
        : 'Account created successfully!',
      token,
      user: safeUser(user),
    });
  } catch (err) {
    console.error('[AUTH] Register error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'This email is already in use.' });
    }
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account suspended. Please contact support.' });
    }
    if (!await user.comparePassword(password)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: safeUser(user),
    });
  } catch (err) {
    console.error('[AUTH] Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// ── GET ME ────────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user: safeUser(user) });
  } catch (err) {
    console.error('[AUTH] GetMe error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── VERIFY REFERRAL CODE ──────────────────────────────────────────────────────
const verifyReferralCode = async (req, res) => {
  try {
    const code = (req.params.code || '').trim().toUpperCase();
    if (!code || code.length < 6) {
      return res.status(400).json({ success: false, message: 'Invalid code.' });
    }

    const referrer = await User.findOne({ referralCode: code })
      .select('firstName lastName referralCode');

    if (!referrer) {
      return res.status(404).json({ success: false, message: 'Referral code not found.' });
    }

    res.json({
      success: true,
      referrer: {
        name: `${referrer.firstName} ${referrer.lastName[0]}.`, // Sécurité : nom partiel
        code: referrer.referralCode,
      },
    });
  } catch (err) {
    console.error('[AUTH] VerifyReferral error:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

module.exports = { register, login, getMe, verifyReferralCode, REFERRAL_BONUS_PERCENT };
