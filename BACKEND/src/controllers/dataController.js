const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const { generateReference, formatPhoneNumber } = require('../utils/helpers');

// Data plans configuration
const DATA_PLANS = {
  MTN: [
    { code: 'MTN_1GB_30', name: '1GB - 30 Days', price: 350, validity: 30 },
    { code: 'MTN_2GB_30', name: '2GB - 30 Days', price: 700, validity: 30 },
    { code: 'MTN_5GB_30', name: '5GB - 30 Days', price: 1500, validity: 30 },
    { code: 'MTN_10GB_30', name: '10GB - 30 Days', price: 3000, validity: 30 }
  ],
  GLO: [
    { code: 'GLO_1GB_30', name: '1GB - 30 Days', price: 350, validity: 30 },
    { code: 'GLO_2GB_30', name: '2GB - 30 Days', price: 700, validity: 30 },
    { code: 'GLO_5GB_30', name: '5GB - 30 Days', price: 1500, validity: 30 }
  ],
  AIRTEL: [
    { code: 'AIRTEL_1GB_30', name: '1GB - 30 Days', price: 350, validity: 30 },
    { code: 'AIRTEL_2GB_30', name: '2GB - 30 Days', price: 700, validity: 30 },
    { code: 'AIRTEL_5GB_30', name: '5GB - 30 Days', price: 1500, validity: 30 }
  ],
  '9MOBILE': [
    { code: '9MOBILE_1GB_30', name: '1GB - 30 Days', price: 400, validity: 30 },
    { code: '9MOBILE_2GB_30', name: '2GB - 30 Days', price: 800, validity: 30 }
  ]
};

// @desc    Purchase data bundle
// @route   POST /api/bills/data
// @access  Private
exports.purchaseData = async (req, res, next) => {
  try {
    const { phoneNumber, planCode, network } = req.body;
    const userId = req.user.id;

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Find the data plan
    const networkPlans = DATA_PLANS[network];
    const selectedPlan = networkPlans?.find(plan => plan.code === planCode);

    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data plan selected'
      });
    }

    // Get wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet || wallet.balance < selectedPlan.price) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }

    // Generate transaction reference
    const reference = generateReference('DATA');

    // Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      type: 'debit',
      category: 'data',
      amount: selectedPlan.price,
      description: `Data purchase: ${selectedPlan.name} for ${formattedPhone}`,
      reference,
      paymentMethod: 'wallet',
      metadata: {
        phoneNumber: formattedPhone,
        network,
        planCode,
        planName: selectedPlan.name,
        validity: selectedPlan.validity
      },
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance - selectedPlan.price
    });

    // Update wallet balance
    wallet.balance -= selectedPlan.price;
    await wallet.save();

    // Here you would integrate with actual data API
    // For now, we'll simulate success
    transaction.status = 'success';
    await transaction.save();

    res.status(200).json({
      success: true,
      message: 'Data purchase successful',
      data: {
        transaction: {
          id: transaction._id,
          reference: transaction.reference,
          amount: transaction.amount,
          status: transaction.status,
          phoneNumber: formattedPhone,
          network,
          plan: selectedPlan
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getDataPlans = async (req, res, next) => {
  try {
    const { network } = req.params;
    
    const plans = DATA_PLANS[network];
    
    if (!plans) {
      return res.status(400).json({
        success: false,
        message: 'Invalid network provider'
      });
    }

    res.status(200).json({
      success: true,
      data: { 
        network,
        plans 
      }
    });
  } catch (error) {
    next(error);
  }};