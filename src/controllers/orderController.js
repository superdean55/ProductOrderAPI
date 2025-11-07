import db from "../models/index.js";
import { successResponse, succrssResponse } from "../utils/response.js";
import { APIError } from "../utils/APIError.js";
import { logger } from "../utils/logger.js";
import validator from "validator";

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

    const productMap = new Map(
      products.map((product) => [product.id, product])
    );

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

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [OrderItem],
      order: [["createdAt", "DESC"]],
    });

    logger.info(`Fetched all orders successfully by user [id=${req.user.id}]`);

    successResponse(res, "Orders fetched successfully", { orders }, 200);
  } catch (err) {
    next(
      new APIError("Failed to fetch orders from the database", 500, null, err)
    );
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.userId },
      include: [OrderItem],
      order: [["createdAt", "DESC"]],
    });

    logger.info(`Fetched orders for user [id=${req.userId}] successfully`);

    successResponse(res, "User orders fetched successfully", { orders }, 200);
  } catch (err) {
    next(
      new APIError(
        "Failed to fetch user orders from the database",
        500,
        null,
        err
      )
    );
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!id || !validator.isUUID(id, 4))
      throw new APIError("Order ID is required", 400);

    const order = await Order.findByPk(id);
    if (!order) throw new APIError("Order not found", 404);

    order.status = status;
    await order.save();

    logger.info(
      `Order [id=${id}] status updated to '${status}' by user [id=${req.user.id}]`
    );

    successResponse(res, "Order status updated successfully", { order }, 200);
  } catch (err) {
    next(new APIError("Failed to update order status", 500, null, err));
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !validator.isUUID(id, 4))
      throw new APIError("Order ID is required", 400);

    const order = await Order.findByPk(id);
    if (!order) throw new APIError("Order not found", 404);

    if (req.user.role !== "ADMIN" && order.userId !== req.userId) {
      throw new APIError("Unauthorized to delete this order", 403);
    }

    await order.destroy();

    logger.info(`Order [id=${id}] deleted by user [id=${req.user.id}]`);

    successResponse(res, "Order deleted successfully", { order }, 200);
  } catch (err) {
    next(new APIError("Failed to delete order", 500, null, err));
  }
};
