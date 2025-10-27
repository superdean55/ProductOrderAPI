import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { isAdminMiddleware } from "../middleware/isAdminMiddleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  createProductValidation,
  updateProductValidation,
} from "../validators/productValidator.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  authMiddleware,
  isAdminMiddleware,
  createProductValidation,
  createProduct
);
router.put(
  "/:id",
  authMiddleware,
  isAdminMiddleware,
  updateProductValidation,
  updateProduct
);
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteProduct);

export default router;
