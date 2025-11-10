export class ProductDTO {
  constructor(product) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.stock = product.stock;
    this.imageUrl = product.imageUrl || null;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }

  static fromModel(productModelInstance) {
    if (!productModelInstance) return null;
    return new ProductDTO(
      productModelInstance.toJSON ? productModelInstance.toJSON() : productModelInstance
    );
  }
}
