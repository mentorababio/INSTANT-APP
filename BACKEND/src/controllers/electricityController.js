// src/controllers/electricityController.js
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const { generateReference } = require('../utils/helpers');

// @desc    Purchase electricity
// @route   POST /api/bills/electricity
// @access  Private
exports.purchaseElectricity = async (req, res, next) => {
  try {
    const { meterNumber, amount, discoCode, customerName } = req.body;
    const userId = req.user.id;

    // Get wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }

    // Generate transaction reference
    const reference = generateReference('ELEC');

    // Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      type: 'debit',
      category: 'electricity',
      amount,
      description: `Electricity payment for meter ${meterNumber}`,
      reference,
      paymentMethod: 'wallet',
      metadata: {
        meterNumber,
        discoCode,
        customerName
      },
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance - amount
    });

    // Update wallet balance
    wallet.balance -= amount;
    await wallet.save();

    // Here you would integrate with actual electricity payment API
    // For now, we'll simulate success
    transaction.status = 'success';
    await transaction.save();

    res.status(200).json({
      success: true,
      message: 'Electricity payment successful',
      data: {
        transaction: {
          id: transaction._id,
          reference: transaction.reference,
          amount: transaction.amount,
          status: transaction.status,
          meterNumber,
          discoCode
        }
      }
    });
  } catch (error) {
    next(error);
  }
};