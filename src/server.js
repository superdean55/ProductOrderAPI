import express from "express";
import cors from "cors";
import db from "./models/index.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import orderItemRoutes from "./routes/orderItem.js";
import userImagesRoutes from "./routes/userImageRoutes.js";
import { isValidJsonBody } from "./middleware/isValidJsonBody.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(isValidJsonBody);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", userImagesRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);

app.get("/", (req, res) => {
  res.json({ message: "E-commerce API is running!" });
});
app.use(errorHandler);
try {
  await db.sequelize.authenticate();
  console.log("✅ Connected to PostgreSQL");

  await db.sequelize.sync({ alter: true });
  console.log("📦 Database synced successfully");
} catch (error) {
  console.error("❌ Database connection failed:", error);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
