import { logger } from "../utils/logger.js";
import { APIError } from "../utils/APIError.js";
import multer from "multer";

export const errorHandler = (err, req, res, next) => {

  if (err instanceof multer.MulterError) {
    err = new APIError(`Multer error: ${err.message}`, 400, null, err);
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format",
      errors: [{ message: err.message }],
    });
  }

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
    originalStack: err.originalError?.stack,
    dbErrors: err.originalError?.errors?.map((e) => ({
      message: e.message,
      path: e.path,
      type: e.type,
    })),
  });

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(err.errors && { errors: err.errors }),
  });
};
