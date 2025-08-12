import { GeneralError } from './general-error';

export class BadRequestError extends GeneralError {
  constructor(message = 'Bad Request', details?: any[]) {
    super(new Error(message), message, 400, details);
  }
}

export class UnauthorizedError extends GeneralError {
  constructor(message = 'Unauthorized', details?: any[]) {
    super(new Error(message), message, 401, details);
  }
}

export class NotFoundError extends GeneralError {
  constructor(message = 'Not Found', details?: any[]) {
    super(new Error(message), message, 404, details);
  }
}

export class UnprocessableEntityError extends GeneralError {
  constructor(message = 'Unprocessable Entity', details?: any[]) {
    super(new Error(message), message, 422, details);
  }
}

export class InternalServerError extends GeneralError {
  constructor(message = 'Internal Server Error', details?: any[]) {
    super(new Error(message), message, 500, details);
  }
}

export class ConflictError extends GeneralError {
  constructor(message = 'Conflict', details?: any[]) {
    super(new Error(message), message, 409, details);
  }
}
