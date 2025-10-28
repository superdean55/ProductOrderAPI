import db from "../models/index.js";
import { validationResult } from "express-validator";

const { OrderItem, Product, Order } = db;

export const createOrderItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { orderId, productId, quantity } = req.body;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const unitPrice = product.price;

    const orderItem = await OrderItem.create({
      orderId,
      productId,
      quantity,
      unitPrice,
    });

    res.status(201).json(orderItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderItemsByOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const items = await OrderItem.findAll({
      where: { orderId },
      include: [{ model: Product }],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const orderItem = await OrderItem.findByPk(id, { include: [Order] });
    if (!orderItem) return res.status(404).json({ message: "Order item not found" });

    if (orderItem.Order.userId !== req.userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "You can only update items in your own orders" });
    }

    if (quantity) orderItem.quantity = quantity;
    await orderItem.save();

    res.json({ message: "Order item updated successfully", orderItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteOrderItem = async (req, res) => {
  const { id } = req.params;

  try {
    const orderItem = await OrderItem.findByPk(id, { include: [Order] });
    if (!orderItem) return res.status(404).json({ message: "Order item not found" });

    if (orderItem.Order.userId !== req.userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "You can only delete items from your own orders" });
    }

    await orderItem.destroy();
    res.json({ message: "Order item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};