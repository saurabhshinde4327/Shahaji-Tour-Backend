const validateUpdateDestination = (req, res, next) => {
  const { from, to } = req.body;

  if (!from || !to) {
    return res.status(400).json({
      success: false,
      message: 'Both from and to locations are required'
    });
  }

  if (typeof from !== 'string' || typeof to !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'From and to must be strings'
    });
  }

  if (from.trim().length === 0 || to.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'From and to locations cannot be empty'
    });
  }

  next();
};

module.exports = {
  validateUpdateDestination
};

