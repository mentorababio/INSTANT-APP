const billerSchema = new mongoose.Schema({
  name: String,
  category: String,
  providerCode: String, // electricity, water, waste, etc.
  apiIntegration: Boolean,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Biller', billerSchema);