const Transaction = require('../models/Transaction');
const BookingService = require('../services/bookingService');
const { sendSuccess, sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');
const logger = require('../utils/logger');

class TransactionController {
  static async create(req, res) {
    try {
      const {
        booking_id,
        client_id,
        amount,
        payment_method,
        payment_details,
        transaction_id
      } = req.body;

      const result = await BookingService.processPayment(
        booking_id,
        client_id,
        amount,
        payment_method,
        payment_details,
        transaction_id
      );

      return sendSuccess(
        res,
        {
          transactionId: result.transactionId,
          receiptNumber: result.receiptNumber
        },
        'Payment processed successfully',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      logger.error('Error creating transaction:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getAll(req, res) {
    try {
      const { client_id, status, from_date, to_date } = req.query;
      const transactions = await Transaction.findAll({ client_id, status, from_date, to_date });
      return sendSuccess(res, { transactions, count: transactions.length });
    } catch (error) {
      logger.error('Error getting transactions:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findById(id);
      if (!transaction) {
        return sendError(res, 'Transaction not found', HTTP_STATUS.NOT_FOUND);
      }
      return sendSuccess(res, { transaction });
    } catch (error) {
      logger.error('Error getting transaction:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getByClient(req, res) {
    try {
      const { clientId } = req.params;
      const transactions = await Transaction.findByClientId(clientId);
      return sendSuccess(res, { transactions });
    } catch (error) {
      logger.error('Error getting client transactions:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = TransactionController;

