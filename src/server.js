import express from "express";
import cors from "cors";
import db from "./models/index.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js"
import orderRoutes from "./routes/order.js";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.json({ message: "E-commerce API is running!" });
});

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
