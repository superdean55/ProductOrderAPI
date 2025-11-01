export class APIError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}