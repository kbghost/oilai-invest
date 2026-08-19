/**
 * routes/auth.js
 *
 * ENDPOINTS PUBLICS :
 *   POST /api/auth/register              → créer un compte
 *   POST /api/auth/login                 → se connecter
 *   GET  /api/auth/me                    → profil (token requis)
 *   GET  /api/auth/referral/verify/:code → vérifier un code de parrainage
 */
const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, verifyReferralCode } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const { parsePhoneNumberFromString, isPossiblePhoneNumber } = require('libphonenumber-js/max');

// Registration validation
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ min: 2 }),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ min: 2 }),
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .custom((value, { req }) => {
      if (!value || !value.trim()) return true;
      const clean = value.trim();
      const countryCode = req.body.phoneCountry || undefined;
      let phoneNumber = null;
      try {
        phoneNumber = clean.startsWith('+')
          ? parsePhoneNumberFromString(clean)
          : parsePhoneNumberFromString(clean, countryCode);
      } catch (e) {}

      const digitsOnly = clean.replace(/\D/g, '');
      const isPossible =
        (phoneNumber && (phoneNumber.isValid() || phoneNumber.isPossible())) ||
        (clean.startsWith('+') ? isPossiblePhoneNumber(clean) : digitsOnly.length >= 7 && digitsOnly.length <= 15);

      if (!isPossible) {
        throw new Error('Invalid phone number for the selected country.');
      }
      return true;
    }),
  // referralCode is optional
];

// Validation connexion
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

router.post('/register', registerValidation, register);
router.post('/login',    loginValidation,    login);
router.get('/me',        protect,            getMe);

// Vérification code parrainage en temps réel (depuis Register.jsx)
// Route publique — pas besoin d'être connecté
router.get('/referral/verify/:code', verifyReferralCode);

module.exports = router;
