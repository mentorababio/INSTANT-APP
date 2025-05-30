const express = require('express');
const {
  purchaseData,
  getDataPlans
} = require('../controllers/dataController');

const { protect } = require('../middleware/authentication');
const { handleValidationErrors } = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

router.use(protect); // All routes are protected

const validateDataPurchase = [
  body('phoneNumber')
    .matches(/^(\+234|0)[789][01]\d{8}$/)
    .withMessage('Please provide a valid Nigerian phone number'),
  
  body('planCode')
    .notEmpty()
    .withMessage('Plan code is required'),
  
  body('network')
    .isIn(['MTN', 'GLO', 'AIRTEL', '9MOBILE'])
    .withMessage('Please select a valid network provider')
];

router.post('/', validateDataPurchase, handleValidationErrors, purchaseData);
router.get('/plans/:network', getDataPlans);

module.exports = router;
// This code defines the routes for data purchase and retrieval of data plans.