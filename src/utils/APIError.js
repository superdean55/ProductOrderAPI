export class APIError extends Error {
  constructor(message, statusCode = 500, errors = null, originalError = null) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.originalError = originalError;
    Error.captureStackTrace(this, this.constructor);
  }
}