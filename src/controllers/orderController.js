import { validationResult } from "express-validator";
import db from "../models/index.js";
import { successResponse, succrssResponse } from "../utils/response.js";
import { APIError } from "../utils/APIError.js";
import { logger } from "../utils/logger.js";

const { Product, Order, OrderItem, sequelize } = db;

export const createOrder = async (req, res, next) => {
  const { items } = req.body;
  const userId = req.user.id;

  const transaction = await sequelize.transaction();

  try {
    
    if (!items || items.length === 0)
      throw new APIError("Order must contain at least one product", 400);

    const productIds = items.map((item) => item.productId);
    const products = await Product.findAll({
      where: { id: productIds },
      transaction,
    });

    const productMap = new Map(products.map((product) => [product.id, product]));

    let totalPrice = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product)
        throw new APIError(`Product not found: ${item.productId}`, 404);
      if (item.quantity <= 0)
        throw new APIError("Quantity must be at least 1", 400);
      totalPrice += parseFloat(product.price) * item.quantity;
    }

    const order = await Order.create(
      { userId, totalPrice, status: "PENDING" },
      { transaction }
    );

    const orderItemsData = items.map((item) => {
      const product = productMap.get(item.productId);
      return {
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    });

    await OrderItem.bulkCreate(orderItemsData, { transaction });

    await transaction.commit();

    logger.info(
      `Order [id=${order.id}] created successfully for user [id=${userId}]`
    );

    successResponse(res, "Order created successfully", { order, items }, 201);
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: [OrderItem] });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.userId },
      include: [OrderItem],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "ADMIN" && order.userId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await order.destroy();
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
