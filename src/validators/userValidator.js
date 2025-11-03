import Joi from "joi";

export const updateUserSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .optional()
    .messages({
      "string.min": "Username must be at least 3 characters",
      "string.base": "Username must be a string"
    }),

  email: Joi.string()
    .email()
    .optional()
    .messages({
      "string.email": "Invalid email format",
      "string.base": "Email must be a string"
    }),

  password: Joi.string()
    .min(6)
    .optional()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.base": "Password must be a string"
    }),
});
