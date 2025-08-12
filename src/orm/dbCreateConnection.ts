import { DataSource } from 'typeorm';
import { logger } from '../services/logger';
import { AppDataSource } from './data-source';

export const dbCreateConnection = async (): Promise<DataSource | null> => {
  try {
    if (AppDataSource.isInitialized) return AppDataSource;
    const ds = await AppDataSource.initialize();
    logger.info({ database: ds.options.database }, 'database connected');
    try {
      await ds.runMigrations();
    } catch (migrationError) {
      logger.warn(
        { err: migrationError },
        'migration execution skipped or failed'
      );
    }
    return ds;
  } catch (err) {
    logger.error({ err }, 'database connection error');
  }
  return null;
};
