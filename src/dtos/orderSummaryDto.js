export class OrderSummaryDTO {
  constructor(order) {
    this.id = order.id;
    this.userId = order.userId;
    this.status = order.status; 
    this.totalPrice = order.totalPrice;
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
  }

  static fromModel(orderModelInstance) {
    if (!orderModelInstance) return null;
    return new OrderSummaryDTO(
      orderModelInstance.toJSON ? orderModelInstance.toJSON() : orderModelInstance
    );
  }
}