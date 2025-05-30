const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const { generateReference } = require('../utils/helpers');

// @desc    Get wallet balance
// @route   GET /api/wallet/balance
// @access  Private
exports.getWalletBalance = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: wallet.balance,
        currency: wallet.currency
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fund wallet
// @route   POST /api/wallet/fund
// @access  Private
exports.fundWallet = async (req, res, next) => {
  try {
    const { amount, paymentMethod = 'card' } = req.body;
    const userId = req.user.id;

    if (amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum funding amount is ₦100'
      });
    }

    // Get wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Generate transaction reference
    const reference = generateReference('FUND');

    // Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      type: 'credit',
      category: 'wallet_funding',
      amount,
      description: `Wallet funding via ${paymentMethod}`,
      reference,
      paymentMethod,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance + amount
    });

    // Here you would integrate with payment gateway (Paystack, Flutterwave, etc.)
    // For now, we'll simulate success
    transaction.status = 'success';
    await transaction.save();

    // Update wallet balance
    wallet.balance += amount;
    await wallet.save();

    res.status(200).json({
      success: true,
      message: 'Wallet funded successfully',
      data: {
        transaction: {
          id: transaction._id,
          reference: transaction.reference,
          amount: transaction.amount,
          status: transaction.status
        },
        newBalance: wallet.balance
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction history
// @route   GET /api/wallet/transactions
// @access  Private
exports.getTransactionHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex)
      .populate('user', 'firstName lastName email');

    const total = await Transaction.countDocuments({ user: req.user.id });

    const pagination = {};
    if (startIndex + limit < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: transactions.length,
      pagination,
      data: { transactions }
    });
  } catch (error) {
    next(error);
  }
};
