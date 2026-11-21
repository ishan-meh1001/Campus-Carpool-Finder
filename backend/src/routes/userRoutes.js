const express = require('express');
const router = express.Router();
const {
  getUserById,
  updateProfile,
  updateVehicle,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect); // All user profile routes require authentication

router.put('/profile', updateProfile);
router.put('/vehicle', updateVehicle);
router.get('/:id', getUserById);

module.exports = router;
