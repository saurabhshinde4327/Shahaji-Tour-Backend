// Authentication middleware

const { sendError } = require('../utils/response');
const constants = require('../constants');

// Simple admin authentication middleware
// In production, use JWT tokens
const authenticateAdmin = async (req, res, next) => {
  try {
    // For now, we'll skip auth middleware and handle it in controllers
    // TODO: Implement JWT-based authentication
    next();
  } catch (error) {
    return sendError(res, 'Authentication failed', constants.HTTP_STATUS.UNAUTHORIZED);
  }
};

// Client authentication middleware
const authenticateClient = async (req, res, next) => {
  try {
    // TODO: Implement JWT-based authentication for clients
    next();
  } catch (error) {
    return sendError(res, 'Authentication failed', constants.HTTP_STATUS.UNAUTHORIZED);
  }
};

module.exports = {
  authenticateAdmin,
  authenticateClient
};

