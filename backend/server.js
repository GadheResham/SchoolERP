import 'dotenv/config';
import app          from './src/app.js';
import { connectDB } from './src/config/db.js';
import { config }    from './src/config/env.js';
import { logger }    from './src/utils/logger.js';

async function start() {
  await connectDB();

  const server = app.listen(config.port, () => {
    logger.info(`🚀  SchoolERP API running on http://localhost:${config.port}`);
    logger.info(`📋  Environment : ${config.nodeEnv}`);
    logger.info(`🏥  Health check: http://localhost:${config.port}/api/health`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

start().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
