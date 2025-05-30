// src/routes/airtime.js
const express = require('express');
const {
  purchaseAirtime,
  getNetworkProviders
} = require('../controllers/airtimeController');

const { protect } = require('../middleware/authentication');
const {
  validateAirtimePayment,
  handleValidationErrors
} = require('../middleware/validation');

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/', validateAirtimePayment, handleValidationErrors, purchaseAirtime);
router.get('/providers', getNetworkProviders);

module.exports = router;