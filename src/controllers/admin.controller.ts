import { Request, Response, NextFunction } from 'express';
import { getRedisClient } from '../services/redis';
import { GeneralError } from '../classes/general-error';

export const resetRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body as { email?: string };
    const r = getRedisClient();

    const actualIp = req.ip; // always use caller IP
    const tasks: Array<Promise<any>> = [];
    if (actualIp) {
      tasks.push(r.del(`rl:global:${actualIp}`));
    }
    if (email) {
      const key = `${actualIp}:${email.toLowerCase()}`;
      tasks.push(r.del(`rl:signin:${key}`));
    }
    await Promise.all(tasks);
    res.status(200).json({ success: true });
  } catch (error) {
    next(new GeneralError(error as Error, 'Unable to reset rate limits', 500));
  }
};
