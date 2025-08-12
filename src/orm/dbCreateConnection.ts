import { Connection, createConnection, getConnectionManager } from 'typeorm';

import config from './config/ormconfig';
import { logger } from '../services/logger';

export const dbCreateConnection = async (): Promise<Connection | null> => {
  try {
    const conn = await createConnection(config);
    logger.info(
      { connection: conn.name, database: conn.options.database },
      'database connected'
    );
    try {
      await conn.runMigrations();
    } catch (migrationError) {
      logger.warn(
        { err: migrationError },
        'migration execution skipped or failed'
      );
    }
    return conn;
  } catch (err) {
    if (err.name === 'AlreadyHasActiveConnectionError') {
      const activeConnection = getConnectionManager().get(config.name);
      return activeConnection;
    }
    logger.error({ err }, 'database connection error');
  }
  return null;
};
