import { GeneralError } from '../classes/general-error';
import { HTTP_CODES } from '../constants/http-codes';

import { ValidationError } from './validation';

/**
 * Create a GeneralError instance based on error type
 * @param error (Error instance) Error to use for response and log
 * @returns GeneralError object used to create error response
 */
export const errorResponse = (error: any): GeneralError => {
  // Preserve explicit GeneralError instances
  if (error instanceof GeneralError) {
    return error;
  }

  // Map validation errors to a 422
  if (error instanceof ValidationError) {
    return new GeneralError(
      error,
      'Unprocessable Entity',
      HTTP_CODES.UnprocessableEntity
    );
  }

  // Map common auth token errors to 401
  const errorName: string | undefined = error?.name;
  if (errorName === 'JsonWebTokenError' || errorName === 'TokenExpiredError') {
    return new GeneralError(error, 'Unauthorized', HTTP_CODES.Unauthorized);
  }

  // Default fallback
  return new GeneralError(
    error,
    'Internal Server Error',
    HTTP_CODES.ServerError
  );
};
