// Application Constants

module.exports = {
  // Booking Status
  BOOKING_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
  },

  // Payment Status
  PAYMENT_STATUS: {
    UNPAID: 'unpaid',
    PAID: 'paid',
    REFUNDED: 'refunded'
  },

  // Transaction Status
  TRANSACTION_STATUS: {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed'
  },

  // Transaction Type
  TRANSACTION_TYPE: {
    PAYMENT: 'payment',
    REFUND: 'refund'
  },

  // Payment Methods
  PAYMENT_METHOD: {
    CASH: 'cash',
    CARD: 'card',
    UPI: 'upi',
    ONLINE: 'online',
    WALLET: 'wallet'
  },

  // Admin Roles
  ADMIN_ROLES: {
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin',
    MANAGER: 'manager'
  },

  // Default Prices
  DEFAULT_PRICES: {
    SEATER: 500.00,
    SLEEPER: 800.00
  },

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  }
};

