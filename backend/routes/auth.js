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

const { parsePhoneNumberFromString } = require('libphonenumber-js/max');

// Registration validation — Phone is PERMISSIVE (format is enforced in controller)
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ min: 2 }),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ min: 2 }),
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional({ nullable: true, checkFalsy: false })
    .custom((value) => {
      if (!value || !value.trim()) return true; // Phone is optional at validation level
      const digitsOnly = String(value).replace(/\D/g, '');
      // Accept any number with 7–15 digits (international standard)
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        throw new Error('Phone number must be between 7 and 15 digits.');
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
