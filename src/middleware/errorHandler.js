import { logger } from "../utils/logger.js";
import { APIError } from "../utils/APIError.js";

export const errorHandler = (err, req, res, next) => {
  if (!(err instanceof APIError)) {
    err = new APIError(
      err.message || "Internal Server Error",
      err.statusCode || 500,
      undefined,
      err
    );
  }

  logger.error(`${req.method} ${req.url} - ${err.message}`, {
    stack: err.stack,
    original: err.originalError
      ? err.originalError.stack || err.originalError.message
      : undefined,
  });

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(err.errors && { errors: err.errors }),
  });
};
