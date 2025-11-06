import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdminMiddleware } from "../middleware/isAdminMiddleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidator.js";
import { validate } from "../middleware/validate.js";
import { isValidJsonBody } from "../middleware/isValidJsonBody.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  isValidJsonBody,
  authMiddleware,
  isAdminMiddleware,
  validate(createProductSchema),
  createProduct
);
router.put(
  "/:id",
  isValidJsonBody,
  authMiddleware,
  isAdminMiddleware,
  validate(updateProductSchema),
  updateProduct
);
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteProduct);

export default router;
