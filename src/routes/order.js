import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdminMiddleware } from "../middleware/isAdminMiddleware.js";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getUserOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validators/orderValidator.js";
import { validate } from "../middleware/validate.js";
import { isValidJsonBody } from "../middleware/isValidJsonBody.js";

const router = express.Router();

router.post(
  "/",
  isValidJsonBody,
  authMiddleware,
  validate(createOrderSchema),
  createOrder
);
router.get("/", authMiddleware, isAdminMiddleware, getAllOrders);
router.get("/my-orders", authMiddleware, getUserOrders);
router.get("/my-order/:id", authMiddleware, getUserOrderById);
router.put(
  "/:id/status",
  isValidJsonBody,
  authMiddleware,
  isAdminMiddleware,
  validate(updateOrderStatusSchema),
  updateOrderStatus
);
router.delete("/:id", authMiddleware, deleteOrder);

export default router;
