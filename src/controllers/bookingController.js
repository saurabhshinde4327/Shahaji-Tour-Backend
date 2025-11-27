const BookingService = require('../services/bookingService');
const { sendSuccess, sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');
const logger = require('../utils/logger');

class BookingController {
  static async create(req, res) {
    try {
      const bookingId = await BookingService.createBooking(req.body);
      return sendSuccess(res, { bookingId }, 'Booking created successfully', HTTP_STATUS.CREATED);
    } catch (error) {
      logger.error('Error creating booking:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getBookedSeats(req, res) {
    try {
      const { routeId, travelDate, travelTime } = req.params;
      const bookedSeats = await BookingService.getBookedSeats(routeId, travelDate, travelTime);
      return sendSuccess(res, { bookedSeats });
    } catch (error) {
      logger.error('Error getting booked seats:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const booking = await BookingService.getBookingById(id);
      return sendSuccess(res, { booking });
    } catch (error) {
      logger.error('Error getting booking:', error);
      if (error.message === 'Booking not found') {
        return sendError(res, error.message, HTTP_STATUS.NOT_FOUND);
      }
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getByClient(req, res) {
    try {
      const { clientId } = req.params;
      const bookings = await BookingService.getBookingsByClient(clientId);
      return sendSuccess(res, { bookings });
    } catch (error) {
      logger.error('Error getting client bookings:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await BookingService.updateBookingStatus(id, status);
      return sendSuccess(res, null, 'Booking status updated successfully');
    } catch (error) {
      logger.error('Error updating booking status:', error);
      if (error.message === 'Booking not found') {
        return sendError(res, error.message, HTTP_STATUS.NOT_FOUND);
      }
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async cancel(req, res) {
    try {
      const { id } = req.params;
      await BookingService.cancelBooking(id);
      return sendSuccess(res, null, 'Booking cancelled successfully');
    } catch (error) {
      logger.error('Error cancelling booking:', error);
      if (error.message === 'Booking not found') {
        return sendError(res, error.message, HTTP_STATUS.NOT_FOUND);
      }
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = BookingController;

