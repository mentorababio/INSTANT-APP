// bill contoller implementation
import { initiateBillPayment } from '../../../services/paymentService.js'; // Nigerian provider adapter

export const payBill = async (req, res) => {
  try {
    // Verify transaction PIN
    const user = await User.findById(req.user.userId);
    if (!user.verifyPin(req.body.pin)) {
      return res.status(401).json({
        error: 'INVALID_PIN',
        message: 'Transaction PIN incorrect'
      });
    }
 
    // Process payment
    const result = await initiateBillPayment({
      userId: req.user.userId,
      provider: req.body.provider,
      amount: req.body.amount,
      billerId: req.body.billerId
    });

    // Nigerian transaction reference format
    const ngrReference = `INSTPAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    res.json({
      message: 'Bill payment processed',
      reference: ngrReference,
      providerResponse: result.providerData // MTN/Electricity provider response
    });

  } catch (error) {
    res.status(error.isProviderError ? 424 : 500).json({
      error: 'BILL_PAYMENT_FAILED',
      message: error.message
    });
  }
};