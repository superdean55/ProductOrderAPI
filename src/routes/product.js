import express from "express";
import { authMiddleware } from "../middleware/auth.js";
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

router.post("/", authMiddleware, createProductValidation, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", authMiddleware, updateProductValidation, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
