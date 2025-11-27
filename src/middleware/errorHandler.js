// Error handling middleware

const logger = require('../utils/logger');
const { sendError } = require('../utils/response');
const constants = require('../constants');

const errorHandler = (err, req, res, next) => {
  logger.error('Server error:', err);

  // Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return sendError(res, 'Duplicate entry. This record already exists.', constants.HTTP_STATUS.CONFLICT);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return sendError(res, 'Validation failed', constants.HTTP_STATUS.BAD_REQUEST, err.errors);
  }

  // Default error
  return sendError(
    res,
    err.message || 'Internal server error',
    err.statusCode || constants.HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
};

// 404 handler
const notFoundHandler = (req, res) => {
  return sendError(res, 'Route not found', constants.HTTP_STATUS.NOT_FOUND);
};

module.exports = {
  errorHandler,
  notFoundHandler
};

