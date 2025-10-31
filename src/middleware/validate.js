export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const err = new Error("Validation failed");
    err.status = 400;
    err.details = error.details.map((d) => d.message);
    return next(err);
  }

  next();
};
