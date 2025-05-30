const express = require('express');
const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/authController');

const { protect } = require('../middleware/authentication');
const {
  validateRegister,
  validateLogin,
  handleValidationErrors
} = require('../middleware/validation');
const {
  createAccountLimiter,
  loginLimiter
} = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', createAccountLimiter, validateRegister, handleValidationErrors, register);
router.post('/login', loginLimiter, validateLogin, handleValidationErrors, login);
router.get('/me', protect, getMe);
router.get('/logout', logout);

module.exports = router;