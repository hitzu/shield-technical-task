'use strict';
import customEnv from 'custom-env';
customEnv.env('development');
import 'reflect-metadata';
import app from './app';
import { dbCreateConnection } from './src/orm/dbCreateConnection';
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
