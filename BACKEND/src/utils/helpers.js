const crypto = require('crypto');

// Generate unique reference
exports.generateReference = (prefix = 'TXN') => {
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

// Format phone number to Nigerian standard
exports.formatPhoneNumber = (phone) => {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');
  
  // Handle different formats
  if (cleaned.startsWith('234')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+234${cleaned.substring(1)}`;
  } else if (cleaned.length === 10) {
    return `+234${cleaned}`;
  }
  
  return phone; // Return original if can't format
};

// Calculate transaction fee
exports.calculateFee = (amount, category) => {
  const feeRates = {
    electricity: 0.01, // 1%
    airtime: 0.005, // 0.5%
    data: 0.005, // 0.5%
    transfer: 0.015 // 1.5%
  };
  
  const rate = feeRates[category] || 0.01;
  const fee = Math.round(amount * rate);
  return Math.max(fee, 10); // Minimum fee of ₦10
};