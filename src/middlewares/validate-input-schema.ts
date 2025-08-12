import { NextFunction, Request, Response } from 'express';
import { UnprocessableEntityError } from '../classes/http-errors';

export const validateSchema = (schema, payload) => (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { error } = schema.validate(req[payload]);
  if (error) {
    const details = (error as any)?.details?.map((d: any) => ({
      message: d.message,
      path: d.path,
      type: d.type,
      context: d.context
    }));
    throw new UnprocessableEntityError('Unprocessable Entity', details);
  }

  next();
};
