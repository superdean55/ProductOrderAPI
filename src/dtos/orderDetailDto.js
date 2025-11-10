export class OrderDetailDTO {
  constructor(order) {
    this.id = order.id;
    this.userId = order.userId;
    this.status = order.status; 
    this.totalPrice = order.totalPrice;
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;

    this.items = Array.isArray(order.items)
      ? order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice, 
        }))
      : [];
  }

  static fromModel(orderModelInstance) {
    if (!orderModelInstance) return null;
    return new OrderDetailDTO(
      orderModelInstance.toJSON ? orderModelInstance.toJSON() : orderModelInstance
    );
  }
}
