const Payment = require('../models/Payment');
const paymentService = require('../services/paymentService');
const { sendSuccess, sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');
const logger = require('../utils/logger');

class PaymentController {
  static async createOrder(req, res) {
    try {
      const { amount, currency, receipt, notes } = req.body;
      if (!amount) {
        return sendError(res, 'amount required (in paise)', HTTP_STATUS.BAD_REQUEST);
      }

      const order = await paymentService.createOrder(amount, currency, receipt, notes);
      return sendSuccess(res, order);
    } catch (error) {
      logger.error('Error creating order:', error);
      return sendError(res, 'Server error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async webhook(req, res) {
    try {
      const signature = req.headers['x-razorpay-signature'];
      await paymentService.handleWebhook(req.body, signature, req.rawBody);
      return sendSuccess(res, { ok: true });
    } catch (error) {
      logger.error('Webhook error:', error);
      if (error.message === 'Invalid webhook signature') {
        return res.status(400).send('Invalid signature');
      }
      return res.status(500).send('Server error');
    }
  }

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

