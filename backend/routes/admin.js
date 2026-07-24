const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { getDashboardStats, getAllUsers, toggleUserStatus, adjustBalance } = require('../controllers/adminController');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle', toggleUserStatus);
router.patch('/users/:id/balance', adjustBalance);

module.exports = router;
