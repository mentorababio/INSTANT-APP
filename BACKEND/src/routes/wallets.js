const express = require('express');
const {
  getWalletBalance,
  fundWallet,
  getTransactionHistory
} = require('../controllers/walletController');

const { protect } = require('../middleware/authentication');
const { handleValidationErrors } = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

router.use(protect); // All routes are protected

// Wallet funding validation
const validateWalletFunding = [
  body('amount')
    .isFloat({ min: 100, max: 1000000 })
    .withMessage('Amount must be between ₦100 and ₦1,000,000'),
  
  body('paymentMethod')
    .optional()
    .isIn(['card', 'bank_transfer', 'ussd'])
    .withMessage('Invalid payment method')
];

router.get('/balance', getWalletBalance);
router.post('/fund', validateWalletFunding, handleValidationErrors, fundWallet);
router.get('/transactions', getTransactionHistory);

module.exports = router;
// This code defines the routes for wallet operations including balance retrieval, funding, and transaction history.