const express = require('express');
const router = express.Router();
const {
  getPlatformStats,
  getAllUsers,
  deleteUser,
  getAllRides,
  deleteRide,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/rides', getAllRides);
router.delete('/rides/:id', deleteRide);

module.exports = router;
