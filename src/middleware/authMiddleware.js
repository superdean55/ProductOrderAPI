import jwt from "jsonwebtoken";
import db from "../models/index.js";
import { APIError } from "../utils/APIError.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new APIError("No token provided", 401));

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.User.findByPk(decoded.id);

    if (!user) return next(new APIError("User not found", 401));

    if (decoded.tokenVersion !== user.tokenVersion)
      return next(new APIError("Token expired", 401));

    req.user = user;

    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return next(new APIError("Token expired", 401, null, err));
    if (err.name === "JsonWebTokenError")
      return next(new APIError("Invalid token", 401, null, err));

    return next(new APIError("Authentication failed", 401, null, err));
  }
};
