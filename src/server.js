import express from "express";
import cors from "cors";
import db from "./models/index.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import productImageRoutes from "./routes/productImageRoutes.js"
import orderRoutes from "./routes/order.js";
import orderItemRoutes from "./routes/orderItem.js";
import userImagesRoutes from "./routes/userImageRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";

const allowedOrigins = [
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'http://192.168.1.204:5173' 
];
const app = express();

app.use(cors({ 
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", userImagesRoutes);
app.use("/api/products", productRoutes);
app.use("/api/prosucts", productImageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);
app.use(notFoundHandler);
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
app.listen(PORT, '0.0.0.0',() => console.log(`🚀 Server running on port ${PORT}`));
