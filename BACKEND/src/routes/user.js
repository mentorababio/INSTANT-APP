// src/routes/user.js
const express = require('express');
const { protect } = require('../middleware/authentication');

const router = express.Router();

router.use(protect); // All routes are protected

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const User = require('../models/user');
    
    const user = await User.findById(req.user.id);
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;