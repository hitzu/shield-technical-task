import customEnv from 'custom-env';
customEnv.env('test');

process.env.PG_HOST = process.env.PG_HOST || 'localhost';
process.env.PG_PORT = process.env.PG_PORT || '5543';
process.env.POSTGRES_USER = process.env.POSTGRES_USER || 'test';
process.env.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'test';
process.env.POSTGRES_DB = process.env.POSTGRES_DB || 'test_db';
process.env.TOKEN_SECRET = process.env.TOKEN_SECRET || 'test_secret';
process.env.TOKEN_SECRET_KEY =
  process.env.TOKEN_SECRET_KEY || 'test_secret_key';
process.env.JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
process.env.NODE_ENV = 'test';
process.env.REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380';

// Ensure Redis client is closed after tests to avoid open handles in Jest
import { getRedisClient } from '../services/redis';

afterAll(async () => {
  try {
    const client = getRedisClient();
    // Prefer graceful quit to flush and close connection
    await client.quit();
  } catch (err) {
    // Fallback: force disconnect if quit fails
    try {
      getRedisClient().disconnect();
    } catch {}
  }
});
