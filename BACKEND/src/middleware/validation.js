const { body, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Registration validation
exports.validateRegister = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('phone')
    .matches(/^(\+234|0)[789][01]\d{8}$/)
    .withMessage('Please provide a valid Nigerian phone number'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Login validation
exports.validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Bill payment validation
exports.validateElectricityPayment = [
  body('meterNumber')
    .isLength({ min: 10, max: 15 })
    .withMessage('Meter number must be between 10 and 15 digits'),
  
  body('amount')
    .isFloat({ min: 100, max: 500000 })
    .withMessage('Amount must be between ₦100 and ₦500,000'),
  
  body('discoCode')
    .isIn(['EKEDC', 'IKEDC', 'KAEDCO', 'PHEDC', 'AEDC', 'BEDC', 'JEDC'])
    .withMessage('Please select a valid electricity distribution company')
];

exports.validateAirtimePayment = [
  body('phoneNumber')
    .matches(/^(\+234|0)[789][01]\d{8}$/)
    .withMessage('Please provide a valid Nigerian phone number'),
  
  body('amount')
    .isFloat({ min: 50, max: 50000 })
    .withMessage('Amount must be between ₦50 and ₦50,000'),
  
  body('network')
    .isIn(['MTN', 'GLO', 'AIRTEL', '9MOBILE'])
    .withMessage('Please select a valid network provider')
];