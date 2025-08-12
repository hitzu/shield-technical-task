import { decode } from '../services/token';
import { NextFunction, RequestHandler } from 'express';
import { RequestCustom } from '../interfaces/start-options.interface';
import { GeneralError } from '../classes/general-error';

const extractBearerToken = (authorizationHeader?: string): string => {
  if (!authorizationHeader) {
    throw new GeneralError(
      new Error('Missing Authorization header'),
      'Unauthorized',
      401
    );
  }

  const header = authorizationHeader.trim();
  const lower = header.toLowerCase();
  if (lower.startsWith('bearer ')) {
    const parts = header.split(' ');
    if (parts.length < 2 || !parts[1]) {
      throw new GeneralError(
        new Error('Invalid Bearer token'),
        'Unauthorized',
        401
      );
    }
    return parts[1].trim();
  }
  // Backward compatibility: accept raw token without Bearer prefix
  return header;
};

export const verifyToken = (): RequestHandler => {
  return async (req: RequestCustom, _, next: NextFunction) => {
    try {
      const token = extractBearerToken(req.headers.authorization as string);
      req.token = await decode(token);
      next();
    } catch (error) {
      next(error);
    }
  };
};
