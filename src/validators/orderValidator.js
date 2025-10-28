import { body } from "express-validator";

export const createOrderValidation = [
  body("items").isArray({ min: 1 }).withMessage("Items must be an array"),
  body("items.*.productId").notEmpty().withMessage("Product ID is required"),
  body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

export const updateOrderStatusValidation = [
  body("status")
    .isIn(["PENDING", "PAID", "SHIPPED", "CANCELLED"])
    .withMessage("Invalid order status"),
];
