import { APIError } from "../utils/APIError.js";

export const isValidJsonBody = (req, res, next) => {
  const methodsWithBody = ["POST", "PUT", "PATCH"];
  if (!methodsWithBody.includes(req.method)) {
    return next();
  }
  if (!req.is("application/json")) {
    return next(new APIError("Content-Type must be application/json", 415));
  }

  if (!req.body || typeof req.body !== "object") {
    return next(new APIError("Request body must be a valid JSON object", 400));
  }

  next();
};
