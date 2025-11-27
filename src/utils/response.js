// Response utility functions

const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, message = 'Internal server error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

const sendValidationError = (res, message = 'Validation failed', errors = []) => {
  return res.status(400).json({
    success: false,
    message,
    errors
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError
};

