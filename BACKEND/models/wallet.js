const walletSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        balance: {
            type: Number,
            default: 0
        },
        transactions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Transaction'
            }],
        amount: {
        type: Number,
        },
        currency: {
            type: String,
            default: 'NGN',
        },
        purpose: {
            type: String,
            required: true,
        },
        timestamp: true});
module.exports = mongoose.model('Wallet', walletSchema);