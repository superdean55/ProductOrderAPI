import Joi from "joi";

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().uuid().required().messages({
          "string.empty": "Product ID is required",
          "any.required": "Product ID is required",
          "string.guid": "Product ID must be a valid UUID",
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "Quantity must be a number",
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Items must be an array",
      "array.min": "At least one item is required",
      "any.required": "Items are required",
    }),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("PENDING", "PAID", "SHIPPED", "CANCELLED")
    .required()
    .messages({
      "any.only": "Invalid order status",
      "any.required": "Order status is required",
    }),
});
