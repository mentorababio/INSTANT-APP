// src/services/paymentService.js
import axios from 'axios';
import Bill from '../models/BillPayment.js';
import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';
import { logToCBN } from './cbnLogger.js';

// Nigerian Bill Providers Configuration
const NIGERIAN_PROVIDERS = {
  // Electricity Providers
  electricity: {
    ikeja: {
      name: "Ikeja Electric",
      endpoint: process.env.IKEJA_ENDPOINT || "https://api.ikejaelectric.com/v1/pay",
      apiKey: process.env.IKEJA_API_KEY,
      disco: "ikeja"
    },
    ekedc: {
      name: "EKEDC",
      endpoint: process.env.EKEDC_ENDPOINT || "https://api.ekedp.com.ng/payment",
      apiKey: process.env.EKEDC_API_KEY,
      disco: "ekedc"
    },
    ibedc: {
      name: "IBEDC",
      endpoint: process.env.IBEDC_ENDPOINT || "https://bill.ibedc.com/api/pay",
      apiKey: process.env.IBEDC_API_KEY,
      disco: "ibedc"
    }
  },
  
  // Data Subscription Providers
  data: {
    mtn: {
      name: "MTN Data",
      endpoint: process.env.MTN_DATA_ENDPOINT || "https://biller.ng/mtn-data",
      apiKey: process.env.MTN_DATA_API_KEY
    },
    airtel: {
      name: "Airtel Data",
      endpoint: process.env.AIRTEL_DATA_ENDPOINT || "https://api.airtel.com/data/purchase",
      apiKey: process.env.AIRTEL_DATA_API_KEY
    },
    glo: {
      name: "Glo Data",
      endpoint: process.env.GLO_DATA_ENDPOINT || "https://gloworld.com/api/data",
      apiKey: process.env.GLO_DATA_API_KEY
    },
    mobile9: {
      name: "9mobile Data",
      endpoint: process.env.MOBILE9_DATA_ENDPOINT || "https://9mobile.com.ng/api/data",
      apiKey: process.env.MOBILE9_API_KEY
    }
  },
  
  // Airtime Providers
  airtime: {
    mtn: {
      name: "MTN Airtime",
      endpoint: process.env.MTN_AIRTIME_ENDPOINT || "https://biller.ng/mtn-airtime",
      apiKey: process.env.MTN_AIRTIME_API_KEY
    },
    airtel: {
      name: "Airtel Airtime",
      endpoint: process.env.AIRTEL_AIRTIME_ENDPOINT || "https://api.airtel.com/airtime",
      apiKey: process.env.AIRTEL_AIRTIME_API_KEY
    },
    glo: {
      name: "Glo Airtime",
      endpoint: process.env.GLO_AIRTIME_ENDPOINT || "https://gloworld.com/api/airtime",
      apiKey: process.env.GLO_AIRTIME_API_KEY
    },
    mobile9: {
      name: "9mobile Airtime",
      endpoint: process.env.MOBILE9_AIRTIME_ENDPOINT || "https://9mobile.com.ng/api/airtime",
      apiKey: process.env.MOBILE9_API_KEY
    }
  }
};

// Helper function to generate Nigerian-style transaction reference
const generateNigerianReference = (prefix = "INSTPAY") => {
  const now = new Date();
  const datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${datePart}-${randomPart}`;
};

/**
 * Initiate bill payment for electricity, data, or airtime
 * @param {Object} params 
 * @returns {Promise<Object>} Result of payment operation
 */
export const initiateBillPayment = async (params) => {
  const { userId, category, provider, amount, details } = params;
  
  // Validate category
  const validCategories = ['electricity', 'data', 'airtime'];
  if (!validCategories.includes(category)) {
    throw new Error('Invalid bill category');
  }

  // Get provider config
  const providerConfig = NIGERIAN_PROVIDERS[category]?.[provider];
  if (!providerConfig) {
    throw new Error(`Unsupported provider for ${category}: ${provider}`);
  }

  // Create transaction record
  const transaction = await Transaction.create({
    user: userId,
    type: `bill_payment_${category}`,
    amount,
    status: 'pending',
    provider,
    reference: generateNigerianReference()
  });

  try {
    // Prepare provider-specific payload
    let providerPayload = { amount };
    
    if (category === 'electricity') {
      providerPayload = {
        ...providerPayload,
        disco: providerConfig.disco,
        meter_number: details.meterNumber,
        meter_type: details.meterType || 'prepaid', // prepaid/postpaid
        phone: details.phone || (await User.findById(userId)).phone
      };
    } else if (category === 'data') {
      providerPayload = {
        ...providerPayload,
        phone: details.phoneNumber,
        data_plan: details.planId || 'default' // Specific data plan
      };
    } else if (category === 'airtime') {
      providerPayload = {
        ...providerPayload,
        phone: details.phoneNumber
      };
    }

    // Add INSTANTPAY reference
    providerPayload.reference = transaction.reference;

    // Call provider API
    const response = await axios.post(
      providerConfig.endpoint,
      providerPayload,
      {
        headers: {
          'Authorization': `Bearer ${providerConfig.apiKey}`,
          'X-Country': 'NG',
          'X-Provider': providerConfig.name
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    // Handle Nigerian provider responses
    if (!response.data.success) {
      throw new Error(response.data.message || `${category} purchase failed with ${provider}`);
    }

    // Debit user's wallet (in kobo)
    const wallet = await Wallet.findOne({ user: userId });
    wallet.balance -= amount * 100; // Convert Naira to kobo
    await wallet.save();

    // Update transaction status
    transaction.status = 'success';
    transaction.providerReference = response.data.reference;
    await transaction.save();

    // Create bill record
    await Bill.create({
      user: userId,
      category,
      provider,
      amount,
      details,
      transaction: transaction._id
    });

    // Log to CBN compliance
    await logToCBN({
      type: `bill_${category}`,
      amount,
      userId,
      provider
    });

    return {
      success: true,
      message: `${category.replace(/_/g, ' ')} purchase successful`,
      reference: transaction.reference,
      providerResponse: response.data
    };

  } catch (error) {
    // Handle provider-specific errors
    let errorMessage = error.message;
    let isProviderError = true;
    
    // Handle common Nigerian provider errors
    if (error.response) {
      const nigerianError = error.response.data.error;
      if (nigerianError === 'INVALID_METER') {
        errorMessage = 'Invalid meter number';
      } else if (nigerianError === 'INSUFFICIENT_VENDOR_BALANCE') {
        errorMessage = 'Provider is currently unable to process payments';
        isProviderError = true;
      } else if (nigerianError === 'SERVER_ERROR') {
        errorMessage = 'Provider service is temporarily unavailable';
        isProviderError = true;
      }
    }

    // Update failed transaction
    transaction.status = 'failed';
    transaction.failureReason = errorMessage;
    await transaction.save();

    // Special handling for airtime failures
    if (category === 'airtime' && errorMessage.includes('insufficient')) {
      // Attempt refund for airtime failures
      try {
        const wallet = await Wallet.findOne({ user: userId });
        wallet.balance += amount * 100;
        await wallet.save();
      } catch (refundError) {
        console.error('Refund failed:', refundError);
      }
    }

    throw new Error(errorMessage);
  }
};

/**
 * Get available Nigerian providers for a category
 * @param {string} category - electricity, data, or airtime
 * @returns {Array} List of available providers
 */
export const getProviders = (category) => {
  if (!NIGERIAN_PROVIDERS[category]) return [];
  return Object.values(NIGERIAN_PROVIDERS[category]).map(p => ({
    name: p.name,
    code: Object.keys(NIGERIAN_PROVIDERS[category]).find(key => NIGERIAN_PROVIDERS[category][key] === p)
  }));
};

/**
 * Validate Nigerian meter number format
 * @param {string} meterNumber 
 * @param {string} disco - Distribution company
 * @returns {boolean}
 */
export const validateMeterNumber = (meterNumber, disco) => {
  // Basic Nigerian meter number validation
  if (!/^\d{6,11}$/.test(meterNumber)) return false;
  
  // Disco-specific validation
  if (disco === 'ikeja') {
    return /^03\d{9}$/.test(meterNumber); // Ikeja Electric format
  } else if (disco === 'ekedc') {
    return meterNumber.length === 11; // EKEDC 11-digit meters
  }
  
  return true;
};

/**
 * Get Nigerian data plans for a provider
 * @param {string} provider - mtn, airtel, glo, mobile9
 * @returns {Array} List of data plans
 */
export const getDataPlans = async (provider) => {
  try {
    const providerConfig = NIGERIAN_PROVIDERS.data[provider];
    if (!providerConfig) return [];
    
    const response = await axios.get(`${providerConfig.endpoint}/plans`, {
      headers: { 'Authorization': `Bearer ${providerConfig.apiKey}` }
    });
    
    return response.data.plans.map(plan => ({
      id: plan.planId,
      name: plan.name,
      validity: plan.validity,
      amount: plan.price
    }));
  } catch (error) {
    console.error(`Failed to get ${provider} data plans:`, error);
    return [];
  }
};