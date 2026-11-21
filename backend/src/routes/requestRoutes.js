const express = require('express');
const router = express.Router();
const {
  createRequest,
  getDriverRequests,
  getRiderRequests,
  respondToRequest,
  cancelRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.use(protect); // All request actions require authentication

router.post('/', createRequest);
router.get('/driver', getDriverRequests);
router.get('/rider', getRiderRequests);
router.put('/:id/status', respondToRequest);
router.put('/:id/cancel', cancelRequest);

module.exports = router;
