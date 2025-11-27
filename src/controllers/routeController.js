const RouteService = require('../services/routeService');
const { sendSuccess, sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');
const logger = require('../utils/logger');

class RouteController {
  static async create(req, res) {
    try {
      const routeId = await RouteService.createRoute(req.body);
      return sendSuccess(res, { routeId }, 'Route added successfully', HTTP_STATUS.CREATED);
    } catch (error) {
      logger.error('Error adding route:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getAll(req, res) {
    try {
      const routes = await RouteService.getAllRoutes();
      return sendSuccess(res, { routes });
    } catch (error) {
      logger.error('Error getting routes:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async search(req, res) {
    try {
      const { from, to } = req.query;
      const route = await RouteService.searchRoute(from, to);
      return sendSuccess(res, { route });
    } catch (error) {
      logger.error('Error getting route:', error);
      if (error.message === 'Route not found') {
        return sendError(res, error.message, HTTP_STATUS.NOT_FOUND);
      }
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const route = await RouteService.getRouteById(id);
      return sendSuccess(res, { route });
    } catch (error) {
      logger.error('Error getting route by ID:', error);
      if (error.message === 'Route not found') {
        return sendError(res, error.message, HTTP_STATUS.NOT_FOUND);
      }
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      await RouteService.updateRoute(id, req.body);
      return sendSuccess(res, null, 'Route updated successfully');
    } catch (error) {
      logger.error('Error updating route:', error);
      if (error.message === 'Route not found') {
        return sendError(res, error.message, HTTP_STATUS.NOT_FOUND);
      }
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async updatePrices(req, res) {
    try {
      const { id } = req.params;
      const { seater_price, sleeper_price } = req.body;
      await RouteService.updateRoutePrices(id, seater_price, sleeper_price);
      return sendSuccess(res, {
        route: {
          id: parseInt(id),
          seater_price: parseFloat(seater_price),
          sleeper_price: parseFloat(sleeper_price)
        }
      }, 'Route prices updated successfully');
    } catch (error) {
      logger.error('Error updating route prices:', error);
      if (error.message === 'Route not found') {
        return sendError(res, error.message, HTTP_STATUS.NOT_FOUND);
      }
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await RouteService.deleteRoute(id);
      return sendSuccess(res, null, 'Route deleted successfully');
    } catch (error) {
      logger.error('Error deleting route:', error);
      if (error.message === 'Route not found') {
        return sendError(res, error.message, HTTP_STATUS.NOT_FOUND);
      }
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async updateDestination(req, res) {
    try {
      const { id } = req.params;
      const { from, to } = req.body;

      if (!from || !to) {
        return sendError(res, 'Both from and to locations are required', HTTP_STATUS.BAD_REQUEST);
      }

      await RouteService.updateDestination(id, from, to);
      return sendSuccess(res, {
        route: {
          id: parseInt(id),
          from: from,
          to: to
        }
      }, 'Route destination updated successfully');
    } catch (error) {
      logger.error('Error updating route destination:', error);
      if (error.message === 'Route not found') {
        return sendError(res, error.message, HTTP_STATUS.NOT_FOUND);
      }
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = RouteController;

