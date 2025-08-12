import { GeneralError } from '../classes/general-error';
import { HTTP_CODES } from '../constants/http-codes';
import { errorResponse } from '../services/error-response';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { logger } from '../services/logger';

export const errorHandler: ErrorRequestHandler = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestId = (req as any).id || req.headers['x-request-id'];
    logger.error({ err: error, requestId }, 'request failed');
    const err: GeneralError = errorResponse(error);
    const response = err.buildResponse(String(requestId || ''));

    res.setHeader('x-request-id', String(requestId || ''));
    res.status(err.code).json(response);
  } catch (error) {
    logger.error({ err: error }, 'error handler failure');
    res
      .status(HTTP_CODES.ServerError)
      .json({ message: 'Internal Server Error', error: true });
  }
};
