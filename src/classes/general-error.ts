export class GeneralError {
  error: Error;
  code: number;
  message: string;
  details?: any[];

  constructor(error: Error, message: string, code: number, details?: any[]) {
    this.error = error;
    this.message = message;
    this.code = code;
    this.details = details;
  }

  buildResponse(requestId?: string) {
    return {
      message: this.message,
      code: this.code,
      requestId: requestId ?? undefined,
      details: this.details,
      error: true
    };
  }
}
