// Database Configuration
// For production, use environment variables
module.exports = {
  db: {
    host: process.env.DB_HOST || '91.108.105.168',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'tour',
    password: process.env.DB_PASSWORD || 'Tour@12345',
    database: process.env.DB_NAME || 'shahaji_tours',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 6000,
    ip: process.env.SERVER_IP || '91.108.105.168'
  },
  app: {
    name: 'Shahaji Tours API',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'development'
  }
};

