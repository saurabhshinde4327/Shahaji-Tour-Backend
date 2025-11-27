const Route = require('../models/Route');
const logger = require('../utils/logger');

class RouteService {
  static async createRoute(data) {
    const routeId = await Route.create(data);
    logger.success(`Route added: ${data.from} -> ${data.to}`);
    return routeId;
  }

  static async getAllRoutes() {
    const routes = await Route.findAll();
    logger.info(`Returning ${routes.length} routes`);
    return routes;
  }

  static async getRouteById(id) {
    const route = await Route.findById(id);
    if (!route) {
      throw new Error('Route not found');
    }
    return route;
  }

  static async searchRoute(from, to) {
    const route = await Route.findByLocations(from, to);
    if (!route) {
      throw new Error('Route not found');
    }
    return route;
  }

  static async updateRoute(id, data) {
    const updated = await Route.update(id, data);
    if (!updated) {
      throw new Error('Route not found');
    }
    logger.success(`Route updated: ID ${id}`);
    return true;
  }

  static async updateRoutePrices(id, seater_price, sleeper_price) {
    const updated = await Route.updatePrices(id, seater_price, sleeper_price);
    if (!updated) {
      throw new Error('Route not found');
    }
    logger.success(`Route prices updated: ID ${id}, Seater: ₹${seater_price}, Sleeper: ₹${sleeper_price}`);
    return true;
  }

  static async deleteRoute(id) {
    const deleted = await Route.delete(id);
    if (!deleted) {
      throw new Error('Route not found');
    }
    logger.success(`Route deleted: ID ${id}`);
    return true;
  }

  static async updateDestination(id, from, to) {
    const updated = await Route.updateDestination(id, from, to);
    if (!updated) {
      throw new Error('Route not found');
    }
    logger.success(`Route destination updated: ID ${id}, ${from} -> ${to}`);
    return true;
  }
}

module.exports = RouteService;

