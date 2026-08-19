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

const { parsePhoneNumberFromString } = require('libphonenumber-js');

// Validation inscription
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('Prénom requis').isLength({ min: 2 }),
  body('lastName').trim().notEmpty().withMessage('Nom requis').isLength({ min: 2 }),
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe : 6 caractères minimum'),
  body('phone')
    .notEmpty().withMessage('Numéro de téléphone requis')
    .custom((value, { req }) => {
      const countryCode = req.body.phoneCountry || undefined;
      const phoneNumber = value.startsWith('+')
        ? parsePhoneNumberFromString(value.trim())
        : parsePhoneNumberFromString(value.trim(), countryCode);
      if (!phoneNumber || !phoneNumber.isValid()) {
        throw new Error('Numéro de téléphone invalide pour le pays sélectionné.');
      }
      return true;
    }),
  // referralCode est OPTIONNEL — pas de validation obligatoire
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
