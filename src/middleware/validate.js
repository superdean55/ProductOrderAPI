import { APIError } from "../utils/APIError.js";

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const validationErrors = error.details.map((err) => ({
      field: err.path.join('.'),
      message: err.message
    }));

    return next(new APIError("Validation failed", 400, validationErrors, error));
  }

  next();
};
