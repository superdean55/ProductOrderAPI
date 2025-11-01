import jwt from "jsonwebtoken";
import db from "../models/index.js";
import { APIError } from "../utils/APIError.js"
import { logger } from "../utils/logger.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new APIError("No token provided", 401));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      return next(new APIError("User not found", 401));
    }

    if (decoded.tokenVersion !== user.tokenVersion) {
     
      return next(new APIError("Token expired", 401));
    }

    req.user = user;
    req.userId = user.id;

    next();
  } catch (err) {
    logger.error("Auth middleware error: " + err.message, { stack: err.stack });
    return next(new APIError("Invalid token", 401));
  }
};

