const Payment = require('../models/Payment');
const { sendSuccess, sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');
const logger = require('../utils/logger');

class PaymentController {
  // Razorpay methods (createOrder, webhook) removed

  static async getAll(req, res) {
    try {
      const { client_id, from_date, to_date } = req.query;
      const payments = await Payment.findAll({ client_id, from_date, to_date });
      return sendSuccess(res, { payments, count: payments.length });
    } catch (error) {
      logger.error('Error getting payment history:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getByReceipt(req, res) {
    try {
      const { receiptNumber } = req.params;
      const payment = await Payment.findByReceiptNumber(receiptNumber);
      if (!payment) {
        return sendError(res, 'Payment receipt not found', HTTP_STATUS.NOT_FOUND);
      }
      return sendSuccess(res, { payment });
    } catch (error) {
      logger.error('Error getting payment by receipt:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getByClient(req, res) {
    try {
      const { clientId } = req.params;
      const payments = await Payment.findByClientId(clientId);
      return sendSuccess(res, { payments });
    } catch (error) {
      logger.error('Error getting client payment history:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = PaymentController;

