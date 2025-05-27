const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['airtime', 'data', 'TV', 'internet'] },
  amount: Number,
  phoneNumber: String,
  provider: String, // e.g., MTN, DSTV
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  transactionRef: { type: String, unique: true }
}, { timestamps: true });
