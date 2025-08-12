'use strict';
require('custom-env').env('development');
import 'reflect-metadata';
import { dbCreateConnection } from './src/orm/dbCreateConnection';
const app = require('./app');
import { logger } from './src/services/logger';

const port = parseInt(process.env.PORT ?? '8080', 10);

(async () => {
  await dbCreateConnection();
  app.listen(port, () => {
    logger.info({ port }, 'server started');
  });
})().catch(error => {
  logger.error({ err: error }, 'failed to start server');
  process.exit(1);
});
