import { body } from "express-validator";

export const createOrderItemValidation = [
  body("orderId").notEmpty().withMessage("Order ID is required"),
  body("productId").notEmpty().withMessage("Product ID is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

export const updateOrderItemValidation = [
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];
