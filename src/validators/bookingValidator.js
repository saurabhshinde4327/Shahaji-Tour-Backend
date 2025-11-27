const validateCreateBooking = (req, res, next) => {
  const { client_id, route_id, travel_date, travel_time, total_amount } = req.body;

  if (!client_id || !route_id || !travel_date || !travel_time || !total_amount) {
    return res.status(400).json({
      success: false,
      message: 'All required fields must be provided'
    });
  }

  next();
};

const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required'
    });
  }

  next();
};

module.exports = {
  validateCreateBooking,
  validateUpdateStatus
};

