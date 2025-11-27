const AdminService = require('../services/adminService');
const { sendSuccess, sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');
const logger = require('../utils/logger');

class AdminController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const admin = await AdminService.login(email, password, req.ip);
      return sendSuccess(res, { admin }, 'Login successful');
    } catch (error) {
      logger.error('Error logging in admin:', error);
      return sendError(res, error.message, HTTP_STATUS.UNAUTHORIZED);
    }
  }

  static async getClients(req, res) {
    try {
      const clients = await AdminService.getAllClients();
      return sendSuccess(res, { clients });
    } catch (error) {
      logger.error('Error getting clients:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getBookings(req, res) {
    try {
      const { status, from_date, to_date } = req.query;
      const bookings = await AdminService.getAllBookings({ status, from_date, to_date });
      return sendSuccess(res, { bookings, count: bookings.length });
    } catch (error) {
      logger.error('Error getting bookings:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getDashboardStats(req, res) {
    try {
      const stats = await AdminService.getDashboardStats();
      return sendSuccess(res, { stats });
    } catch (error) {
      logger.error('Error getting dashboard stats:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = AdminController;

