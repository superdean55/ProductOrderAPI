import { body } from "express-validator";

export const createProductValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
];

export const updateProductValidation = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
];