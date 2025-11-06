import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      "string.base": "Name must be a string",
      "any.required": "Name is required",
      "string.empty": "Name is required"
    }),

  price: Joi.number()
    .greater(0)
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.greater": "Price must be a positive number",
      "any.required": "Price is required"
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      "number.base": "Stock must be a number",
      "number.integer": "Stock must be an integer",
      "number.min": "Stock must be a non-negative integer"
    }),
    description: Joi.string()
    .min(10)
    .max(1000)
    .optional()
    .messages({
      "string.base": "Description must be a string",
      "string.min": "Description must be at least 10 characters",
      "string.max": "Description cannot exceed 1000 characters"
    }),
}).unknown(false); 


export const updateProductSchema = Joi.object({
  name: Joi.string()
    .optional()
    .messages({
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty"
    }),

  price: Joi.number()
    .greater(0)
    .optional()
    .messages({
      "number.base": "Price must be a number",
      "number.greater": "Price must be a positive number"
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      "number.base": "Stock must be a number",
      "number.integer": "Stock must be an integer",
      "number.min": "Stock must be a non-negative integer"
    }),
    description: Joi.string()
    .min(10)
    .max(1000)
    .optional()
    .messages({
      "string.base": "Description must be a string",
      "string.min": "Description must be at least 10 characters",
      "string.max": "Description cannot exceed 1000 characters"
    })
}).unknown(false);
