const billProviderSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "MTN Airtime"
  category: { type: String, enum: ['airtime', 'electricity', 'tv'] },
  apiKey: { type: String, required: true }, // Provider API credentials
  endpoint: { type: String, required: true } // e.g., "https://bill-api.com/pay"
  });
const BillProvider = mongoose.model('BillProvider', billProviderSchema);