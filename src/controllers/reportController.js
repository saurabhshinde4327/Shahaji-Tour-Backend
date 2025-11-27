const ReportService = require('../services/reportService');
const { sendSuccess, sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');
const logger = require('../utils/logger');

class ReportController {
  static async getRevenueReport(req, res) {
    try {
      const { from_date, to_date } = req.query;
      const report = await ReportService.getRevenueReport(from_date, to_date);
      return sendSuccess(res, report);
    } catch (error) {
      logger.error('Error getting revenue report:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getPopularRoutes(req, res) {
    try {
      const routes = await ReportService.getPopularRoutes();
      return sendSuccess(res, { routes });
    } catch (error) {
      logger.error('Error getting popular routes:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = ReportController;

