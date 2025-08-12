import { Request, Response, NextFunction, RequestHandler } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { getRedisClient } from '../services/redis';

const toInt = (v: string | undefined, def: number) => {
  const n = parseInt(String(v || ''), 10);
  return Number.isFinite(n) && n > 0 ? n : def;
};

const globalPoints = toInt(process.env.RATE_LIMIT_POINTS, 100);
const globalDuration = toInt(process.env.RATE_LIMIT_DURATION, 60);
const signinPoints = toInt(process.env.SIGNIN_RATE_LIMIT_POINTS, 5);
const signinDuration = toInt(process.env.SIGNIN_RATE_LIMIT_DURATION, 900);

let globalLimiter: RateLimiterRedis | null = null;
let signinLimiter: RateLimiterRedis | null = null;

export const rateLimitGlobal = (): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'test') return next();
    try {
      if (!globalLimiter) {
        globalLimiter = new RateLimiterRedis({
          storeClient: getRedisClient(),
          keyPrefix: 'rl:global',
          points: globalPoints,
          duration: globalDuration
        });
      }
      await (globalLimiter as RateLimiterRedis).consume(req.ip);
      next();
    } catch (err) {
      if (err && 'msBeforeNext' in err) {
        return res.status(429).json({ message: 'Too Many Requests' });
      }
      return next();
    }
  };
};

export const rateLimitSignin = (): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'test') return next();
    const email = (req.body?.email || '').toString().toLowerCase();
    const key = `${req.ip}:${email}`;
    try {
      if (!signinLimiter) {
        signinLimiter = new RateLimiterRedis({
          storeClient: getRedisClient(),
          keyPrefix: 'rl:signin',
          points: signinPoints,
          duration: signinDuration
        });
      }
      await (signinLimiter as RateLimiterRedis).consume(key);
      next();
    } catch (err) {
      if (err && 'msBeforeNext' in err) {
        return res
          .status(429)
          .json({ message: 'Too Many Requests: Signin limited' });
      }
      return next();
    }
  };
};
