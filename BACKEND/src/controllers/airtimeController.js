// src/controllers/airtimeController.js
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const { generateReference, formatPhoneNumber } = require('../utils/helpers');

// @desc    Purchase airtime
// @route   POST /api/bills/airtime
// @access  Private
exports.purchaseAirtime = async (req, res, next) => {
  try {
    const { phoneNumber, amount, network } = req.body;
    const userId = req.user.id;

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Get wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }

    // Generate transaction reference
    const reference = generateReference('AIR');

    // Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      type: 'debit',
      category: 'airtime',
      amount,
      description: `Airtime purchase for ${formattedPhone}`,
      reference,
      paymentMethod: 'wallet',
      metadata: {
        phoneNumber: formattedPhone,
        network
      },
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance - amount
    });

    // Update wallet balance
    wallet.balance -= amount;
    await wallet.save();

    // Here you would integrate with actual airtime API
    // For now, we'll simulate success
    transaction.status = 'success';
    await transaction.save();

    res.status(200).json({
      success: true,
      message: 'Airtime purchase successful',
      data: {
        transaction: {
          id: transaction._id,
          reference: transaction.reference,
          amount: transaction.amount,
          status: transaction.status,
          phoneNumber: formattedPhone,
          network
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get network providers
// @route   GET /api/bills/airtime/providers
// @access  Private
exports.getNetworkProviders = async (req, res, next) => {
  try {
    const { NETWORK_PROVIDERS } = require('../utils/constants');
    
    const providers = Object.entries(NETWORK_PROVIDERS).map(([code, name]) => ({
      code,
      name
    }));

    res.status(200).json({
      success: true,
      data: { providers }
    });
  } catch (error) {
    next(error);
  }
};