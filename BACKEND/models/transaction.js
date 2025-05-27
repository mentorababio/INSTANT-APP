const transactionHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['credit', 'debit'] },
  source: String, // e.g., "Payment", "Wallet Topup"
  amount: Number,
  transactionRef: String
}, { timestamps: true });
