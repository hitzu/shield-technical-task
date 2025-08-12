import { decode } from '../services/token';
import { NextFunction, RequestHandler } from 'express';
import { RequestCustom } from '../interfaces/start-options.interface';

export const verifyToken = (): RequestHandler => {
  return async (req: RequestCustom, _, next: NextFunction) => {
    try {
      req.token = await decode(req.headers.authorization);
      next();
    } catch (error) {
      next(error);
    }
  };
};
