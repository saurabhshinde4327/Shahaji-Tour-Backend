const validateCreateTransaction = (req, res, next) => {
  const { booking_id, client_id, amount, payment_method } = req.body;

  if (!booking_id || !client_id || !amount || !payment_method) {
    return res.status(400).json({
      success: false,
      message: 'Booking ID, client ID, amount, and payment method are required'
    });
  }

  next();
};

module.exports = {
  validateCreateTransaction
};

