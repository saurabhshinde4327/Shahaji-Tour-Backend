require('dotenv').config();
const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

const PORT = config.server.port;

const HOST = process.env.HOST || '0.0.0.0';
const SERVER_IP = process.env.SERVER_IP || '91.108.105.168';

app.listen(PORT, HOST, () => {
  logger.info('\n═══════════════════════════════════════════════════════');
  logger.info('🚀 Shahaji Tours API Server');
  logger.info('═══════════════════════════════════════════════════════');
  logger.info(`📍 Local URL:     http://localhost:${PORT}`);
  logger.info(`🌐 Network URL:   http://${SERVER_IP}:${PORT}`);
  logger.info(`🔌 Listening on: ${HOST}:${PORT}`);
  logger.info(`📦 Environment:   ${config.app.env}`);
  logger.info(`💾 Database:      ${config.db.database} @ ${config.db.host}:${config.db.port}`);
  logger.info('═══════════════════════════════════════════════════════\n');
});

