const Booking = require('../models/Booking');
const Transaction = require('../models/Transaction');
const Payment = require('../models/Payment');
const constants = require('../constants');
const logger = require('../utils/logger');

class BookingService {
  static async createBooking(data) {
    const bookingId = await Booking.create(data);
    logger.success(`Booking created: ID ${bookingId} for client ${data.client_id}`);
    return bookingId;
  }

  static async getBookedSeats(routeId, travelDate, travelTime) {
    return await Booking.getBookedSeats(routeId, travelDate, travelTime);
  }

  static async getBookingById(id) {
    const booking = await Booking.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  static async getBookingsByClient(clientId) {
    return await Booking.findByClientId(clientId);
  }

  static async updateBookingStatus(id, status) {
    const updated = await Booking.updateStatus(id, status);
    if (!updated) {
      throw new Error('Booking not found');
    }
    logger.success(`Booking ${id} status updated to: ${status}`);
    return true;
  }

  static async cancelBooking(id) {
    const cancelled = await Booking.cancel(id);
    if (!cancelled) {
      throw new Error('Booking not found');
    }
    logger.success(`Booking cancelled: ID ${id}`);
    return true;
  }

  static async processPayment(bookingId, clientId, amount, paymentMethod, paymentDetails, transactionId) {
    // Create transaction
    const transactionId_db = await Transaction.create({
      booking_id: bookingId,
      client_id: clientId,
      amount,
      payment_method: paymentMethod,
      payment_details: paymentDetails,
      transaction_id: transactionId,
      description: 'Booking payment'
    });

    // Update booking payment status
    await Booking.updatePaymentStatus(bookingId, constants.PAYMENT_STATUS.PAID, constants.BOOKING_STATUS.CONFIRMED);

    // Generate receipt number
    const receiptNumber = `RCP${Date.now()}${bookingId}`;

    // Create payment history
    await Payment.createHistory({
      transaction_id: transactionId_db,
      booking_id: bookingId,
      client_id: clientId,
      amount,
      payment_method: paymentMethod,
      receipt_number: receiptNumber
    });

    logger.success(`Transaction created: ID ${transactionId_db} for booking ${bookingId}`);
    return { transactionId: transactionId_db, receiptNumber };
  }
}

module.exports = BookingService;

