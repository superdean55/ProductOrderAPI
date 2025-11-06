import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdminMiddleware } from "../middleware/isAdminMiddleware.js";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import {
  createOrderValidation,
  updateOrderStatusValidation,
} from "../validators/orderValidator.js";
import { isValidJsonBody } from "../middleware/isValidJsonBody.js";

const router = express.Router();

router.post(
  "/",
  isValidJsonBody,
  authMiddleware,
  createOrderValidation,
  createOrder
);
router.get("/", authMiddleware, isAdminMiddleware, getAllOrders);
router.get("/my-orders", authMiddleware, getUserOrders);
router.put(
  "/:id/status",
  isValidJsonBody,
  authMiddleware,
  isAdminMiddleware,
  updateOrderStatusValidation,
  updateOrderStatus
);
router.delete("/:id", authMiddleware, deleteOrder);

export default router;
