const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  billerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Biller' },
  accountNumber: String,
  alias: String, // e.g., "My PHCN Prepaid"
  autoPay: { type: Boolean, default: false }
}, { timestamps: true });
