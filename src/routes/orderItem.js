import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createOrderItem,
  getOrderItemsByOrder,
  updateOrderItem,
  deleteOrderItem,
} from "../controllers/orderItemController.js";
import {
  createOrderItemValidation,
  updateOrderItemValidation,
} from "../validators/orderItemValidator.js";

const router = express.Router();

router.post("/", authMiddleware, createOrderItemValidation, createOrderItem);
router.get("/:orderId", authMiddleware, getOrderItemsByOrder);
router.put("/:id", authMiddleware, updateOrderItemValidation, updateOrderItem);
router.delete("/:id", authMiddleware, deleteOrderItem);

export default router;
