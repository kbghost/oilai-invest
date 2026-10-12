const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { 
  getDashboardStats, 
  getAllUsers, 
  getUserDetails,
  updateUser,
  resetUserPassword,
  deleteUser,
  toggleUserStatus, 
  adjustBalance,
  getAllInvestments,
  updateInvestmentStatus
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, adminOnly);

// Stats & Users
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id', updateUser);
router.patch('/users/:id/password', resetUserPassword);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle', toggleUserStatus);
router.patch('/users/:id/balance', adjustBalance);

// Investments Management
router.get('/investments', getAllInvestments);
router.patch('/investments/:id/status', updateInvestmentStatus);

module.exports = router;

