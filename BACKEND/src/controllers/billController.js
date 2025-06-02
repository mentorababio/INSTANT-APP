// src/api/v1/controllers/billController.js
const {
  initiateBillPayment,
} = require("../../../BACKEND/src/services/paymentService");
const User = require("../../../BACKEND/src/models/User");
const { getProviders, getDataPlans } = require("../utils/constants");

// Pay bill
exports.payBill = async (req, res) => {
  try {
    const { category, provider, amount, details, pin } = req.body;

    // Verify transaction PIN
    const user = await User.findById(req.user.userId);
    if (!user.verifyTransactionPin(pin)) {
      return res.status(401).json({
        error: "INVALID_PIN",
        message: "Transaction PIN incorrect",
      });
    }

    // Process payment
    const result = await initiateBillPayment({
      userId: req.user.userId,
      category,
      provider,
      amount,
      details,
    });

    res.json({
      success: true,
      message: result.message,
      reference: result.reference,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "BILL_PAYMENT_FAILED",
      message: error.message,
    });
  }
};

// Get bill providers
exports.getBillProviders = async (req, res) => {
  const { category } = req.params;
  const providers = getProviders(category);
  res.json({ category, providers });
};

// Get data plans
exports.getDataPlans = async (req, res) => {
  const { provider } = req.params;
  const plans = await getDataPlans(provider);
  res.json({ provider, plans });
};

// Get electricity providers
exports.getElectricityProviders = async (req, res, next) => {
  try {
    const { ELECTRICITY_PROVIDERS } = require("../utils/constants");

    const providers = Object.entries(ELECTRICITY_PROVIDERS).map(
      ([code, name]) => ({
        code,
        name,
      })
    );

    res.status(200).json({
      success: true,
      data: { providers },
    });
  } catch (error) {
    next(error);
  }
};

// Validate meter number
exports.validateMeter = async (req, res, next) => {
  try {
    const { meterNumber, discoCode } = req.body;

    const isValid = meterNumber.length >= 10 && meterNumber.length <= 15;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid meter number",
      });
    }

    const customerData = {
      name: "John Doe",
      address: "123 Electric Ave, Lagos",
      meterType: "Postpaid",
      trafficClass: "Residential",
    };

    res.status(200).json({
      success: true,
      message: "Meter validation successful",
      data: {
        meterNumber,
        discoCode,
        customer: customerData,
      },
    });
  } catch (error) {
    next(error);
  }
};
