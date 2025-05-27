const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  billerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Biller' },
  amount: Number,
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  paymentMethod: String,
  transactionRef: { type: String, unique: true },
  paidAt: Date
}, { timestamps: true });
