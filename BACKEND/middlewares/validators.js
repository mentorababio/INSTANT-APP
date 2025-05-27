const { body } = require('express-validator');

const validateBillPayment = [
  body('provider').notEmpty(),
  body('amount').isNumeric(),
  body('billerId').notEmpty()
];