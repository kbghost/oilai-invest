require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB...');

  // Create admin
  const existing = await User.findOne({ email: 'admin@oilai.com' });
  if (!existing) {
    await User.create({
      firstName: 'Admin',
      lastName: 'OilAI',
      email: 'admin@oilai.com',
      password: 'Admin@1234',
      role: 'admin',
      isVerified: true,
      isActive: true
    });
    console.log('✅ Admin created: admin@oilai.com / Admin@1234');
  } else {
    console.log('ℹ️  Admin already exists.');
  }

  // Create demo user
  const demoExists = await User.findOne({ email: 'demo@oilai.com' });
  if (!demoExists) {
    await User.create({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@oilai.com',
      password: 'Demo@1234',
      role: 'user',
      balance: 5000,
      totalInvested: 2000,
      totalEarnings: 350,
      isVerified: true,
      isActive: true
    });
    console.log('✅ Demo user created: demo@oilai.com / Demo@1234');
  }

  await mongoose.disconnect();
  console.log('🎉 Seeding complete!');
};

seed().catch(console.error);
