const ClientService = require('../services/clientService');
const { sendSuccess, sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');
const logger = require('../utils/logger');

class ClientController {
  static async register(req, res) {
    try {
      const clientId = await ClientService.register(req.body);
      return sendSuccess(res, { clientId }, 'Account created and stored in database!', HTTP_STATUS.CREATED);
    } catch (error) {
      logger.error('Error registering client:', error);
      if (error.message === 'Email already exists!') {
        return sendError(res, error.message, HTTP_STATUS.CONFLICT);
      }
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const client = await ClientService.login(email, password);
      return sendSuccess(res, { client }, 'Login successful');
    } catch (error) {
      logger.error('Error logging in:', error);
      return sendError(res, error.message, HTTP_STATUS.UNAUTHORIZED);
    }
  }

  static async getTotal(req, res) {
    try {
      const total = await ClientService.getTotalClients();
      return sendSuccess(res, { total });
    } catch (error) {
      logger.error('Error getting total clients:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = ClientController;

