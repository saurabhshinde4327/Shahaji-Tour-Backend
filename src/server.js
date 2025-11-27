require('dotenv').config();
const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

const PORT = config.server.port;

app.listen(PORT, '0.0.0.0', () => {
  logger.info('\nShahaji Tours API Server');
  logger.info(`API Base URL: http://localhost:${PORT}`);
  logger.info(`Network Access: http://0.0.0.0:${PORT}`);
  logger.info(`Environment: ${config.app.env}`);
  logger.info(`Database: ${config.db.database} @ ${config.db.host}:${config.db.port}\n`);
});

