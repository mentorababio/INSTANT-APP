module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  
  // Payment Gateway Config
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
  FLUTTERWAVE_SECRET_KEY: process.env.FLUTTERWAVE_SECRET_KEY,
  
  // Bill Payment APIs
  BUYPOWER_BASE_URL: process.env.BUYPOWER_BASE_URL,
  BUYPOWER_API_KEY: process.env.BUYPOWER_API_KEY,
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100, // limit each IP to 100 requests per windowMs
};
