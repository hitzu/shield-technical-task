import Redis from 'ioredis';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (redisClient) return redisClient;
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  redisClient = new Redis(url, {
    maxRetriesPerRequest: 2
  });
  return redisClient;
};
