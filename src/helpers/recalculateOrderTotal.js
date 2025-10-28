import db from "../models/index.js";

export const recalculateOrderTotal = async (orderId) => {
  try {
    const orderItems = await db.OrderItem.findAll({ where: { orderId } });

    const total = orderItems.reduce((sum, item) => {
      return sum + parseFloat(item.unitPrice) * item.quantity;
    }, 0);

    await db.Order.update(
      { totalPrice: total.toFixed(2) },
      { where: { id: orderId } }
    );

    console.log(`✅ Order ${orderId} total updated: ${total.toFixed(2)}`);
  } catch (err) {
    console.error(`❌ Error recalculating order total: ${err.message}`);
  }
};
