import { APIError } from "../utils/APIError.js";

export const isValidJsonBody = (req, res, next) => {
  if (req.is("multipart/form-data")) {
    return next();
  }
  const methodsWithBody = ["POST", "PUT", "PATCH"];
  if (methodsWithBody.includes(req.method)) {
    if (!req.is("application/json")) {
      return next(new APIError("Content-Type must be application/json", 415));
    }

    if (!req.body || typeof req.body !== "object") {
      return next(
        new APIError("Request body must be a valid JSON object", 400)
      );
    }

    if (Object.keys(req.body).length === 0) {
      return next(new APIError("Empty request body", 400));
    }
  }

  return next();
};
