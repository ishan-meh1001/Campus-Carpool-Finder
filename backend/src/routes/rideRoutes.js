const express = require('express');
const router = express.Router();
const {
  createRide,
  getRides,
  getRideById,
  getMyOfferedRides,
  completeRide,
  cancelRide,
} = require('../controllers/rideController');
const { protect } = require('../middleware/auth');

// Public route to search & view rides
router.get('/', getRides);
router.get('/user/my-rides', protect, getMyOfferedRides);
router.get('/:id', getRideById);

// Protected routes for ride creation & modification
router.post('/', protect, createRide);
router.put('/:id/complete', protect, completeRide);
router.put('/:id/cancel', protect, cancelRide);

module.exports = router;
