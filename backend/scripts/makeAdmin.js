/**
 * ════════════════════════════════════════════════════════════════
 * scripts/makeAdmin.js — Promouvoir un utilisateur en administrateur
 * ════════════════════════════════════════════════════════════════
 *
 * USAGE :
 *   node scripts/makeAdmin.js email@exemple.com
 *
 * Si l'utilisateur existe → son rôle passe à 'admin'
 * Si l'utilisateur n'existe pas → un compte admin est créé
 *
 * Mot de passe admin par défaut si création : Admin@2025!
 * (À changer immédiatement après connexion)
 * ════════════════════════════════════════════════════════════════
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const USER_MODEL_PATH = '../models/User';

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('❌  Usage : node scripts/makeAdmin.js email@exemple.com');
    process.exit(1);
  }

  console.log(`🔌  Connexion MongoDB…`);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`✅  MongoDB connecté`);

  const User = require(USER_MODEL_PATH);

  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    // Promouvoir l'utilisateur existant
    user.role     = 'admin';
    user.isActive = true;
    await user.save({ validateBeforeSave: false });
    console.log(`\n🎉  Utilisateur PROMU admin :`);
    console.log(`   Email    : ${user.email}`);
    console.log(`   Nom      : ${user.firstName} ${user.lastName}`);
    console.log(`   Rôle     : ${user.role}`);
  } else {
    // Créer un nouveau compte admin
    const defaultPassword = 'Admin@2025!';
    const hashedPassword  = await bcrypt.hash(defaultPassword, 12);

    user = await User.create({
      firstName: 'Admin',
      lastName:  'OilAI',
      email:     email.toLowerCase(),
      password:  hashedPassword,
      role:      'admin',
      isActive:  true,
      isVerified: true,
    });

    console.log(`\n🎉  Compte ADMIN créé :`);
    console.log(`   Email    : ${user.email}`);
    console.log(`   Password : ${defaultPassword}  ← CHANGEZ CE MOT DE PASSE !`);
    console.log(`   Rôle     : ${user.role}`);
  }

  console.log(`\n   → Connectez-vous sur /login puis allez sur /admin`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('❌  Erreur :', err.message);
  process.exit(1);
});
