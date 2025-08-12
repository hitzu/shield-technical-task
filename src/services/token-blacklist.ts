import { getRedisClient } from './redis';

export const blacklistJti = async (
  jti: string,
  ttlSeconds: number
): Promise<void> => {
  const r = getRedisClient();
  await r.set(`bl:jti:${jti}`, '1', 'EX', Math.max(1, ttlSeconds));
};

export const isBlacklisted = async (jti: string): Promise<boolean> => {
  const r = getRedisClient();
  return (await r.exists(`bl:jti:${jti}`)) === 1;
};
