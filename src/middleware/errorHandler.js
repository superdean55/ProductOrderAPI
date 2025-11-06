import { logger } from "../utils/logger.js";
import { APIError } from "../utils/APIError.js";
import multer from "multer";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof APIError) {
    logger.error(`${req.method} ${req.url} - ${err.message}`, {
      stack: err.stack,
      originalStack: err.originalError?.stack,
      dbErrors: err.originalError?.errors?.map((e) => ({
        message: e.message,
        path: e.path,
        type: e.type,
      })),
    });

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    logger.error(`Syntax error: Invalid JSON body: ${err.message}`);
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format",
      errors: [{ message: err.message }],
    });
  }

  if (err instanceof multer.MulterError) {
    logger.error(`Multer error: ${err.message}`);
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  if (
    err.name?.startsWith("Sequelize") ||
    err.original?.name?.startsWith("Sequelize")
  ) {
    logger.error(`Database error: ${err.message}`, {
      stack: err.stack,
      details: err.errors?.map((e) => ({
        message: e.message,
        path: e.path,
        type: e.type,
      })),
    });

    return res.status(500).json({
      success: false,
      message: "Database operation failed",
      ...(process.env.NODE_ENV === "development" && { errors: err.message }),
    });
  }

  logger.error(`Unexpected error: ${err.message}`, { stack: err.stack });

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { errors: err.stack }),
  });
};
