import Joi from "joi";

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).optional().messages({
    "string.base": "First name must be a string",
    "string.min": "First name must contain at least 2 character",
  }),

  lastName: Joi.string().min(2).optional().messages({
    "string.base": "Last name must be a string",
    "string.min": "Last name must contain at least 2 character",
  }),

  phoneNumber: Joi.string()
  .pattern(/^\+?[0-9]{7,15}$/)
  .optional()
  .messages({
    "string.pattern.base":
    "Phone number must contain only digits and can start with +, length between 7 and 15",
    "string.base": "Phone number must be a string",
  }),
  dateOfBirth: Joi.date().iso().optional().messages({
    "date.base": "Date of birth must be a valid date",
    "date.format": "Date of birth must be in ISO format",
  }),
}).unknown(false);

