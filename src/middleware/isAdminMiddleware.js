import { logger } from "../utils/logger.js";
import { APIError } from "../utils/APIError.js";

export const isAdminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return next(new APIError("Unauthorized", 401))
    }
    
    if (req.user.role !== "ADMIN") {
      return next(new APIError("Access denied: Admins only", 403));
    }

    next();
  } catch (err) {
    logger.error("isAdminMiddleware error: " + err.message, { stack: err.stack });
    return next(err);
  }
};
