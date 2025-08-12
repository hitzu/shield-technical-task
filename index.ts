'use strict';
require('custom-env').env('development');
import 'reflect-metadata';
import { dbCreateConnection } from './src/orm/dbCreateConnection';
const app = require('./app');

const port = parseInt(process.env.PORT ?? '8080', 10);

(async () => {
  await dbCreateConnection();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
