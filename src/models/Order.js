import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default (sequelize) => {
  class Order extends Model {
    static associate(models) {
        Order.belongsTo(models.User,{ foreignKey: 'userId'});
        Order.hasMany(models.OrderItem, { foreignKey: "orderId" });
    }
  }
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("PENDING", "PAID", "SHIPPED", "CANCELLED"),
        defaultValue: "PENDING",
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      timestamps: true,
      underscored: true,
    }
  );
  return Order;
};
