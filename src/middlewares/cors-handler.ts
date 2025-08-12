import { NextFunction, Request, RequestHandler, Response } from 'express';

export const corsHandler = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.set(
      'Access-Control-Allow-Headers',
      'X-Amz-Date, Content-Type, Authorization, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent, odin, loki, thor'
    );

    next();
  };
};
