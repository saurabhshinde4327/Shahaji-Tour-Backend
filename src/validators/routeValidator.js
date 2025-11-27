const validateCreateRoute = (req, res, next) => {
  const { from, to, price, duration, timings } = req.body;

  if (!from || !to || !price || !duration || !timings) {
    return res.status(400).json({
      success: false,
      message: 'All fields (from, to, price, duration, timings) are required'
    });
  }

  next();
};

const validateUpdateRoute = (req, res, next) => {
  const { from, to, price, duration, timings } = req.body;

  if (!from || !to || !price || !duration || !timings) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  next();
};

const validateUpdatePrices = (req, res, next) => {
  const { seater_price, sleeper_price } = req.body;

  if (seater_price === undefined || sleeper_price === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Both seater_price and sleeper_price are required'
    });
  }

  next();
};

const validateSearchRoute = (req, res, next) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({
      success: false,
      message: 'From and to locations are required'
    });
  }

  next();
};

module.exports = {
  validateCreateRoute,
  validateUpdateRoute,
  validateUpdatePrices,
  validateSearchRoute
};

