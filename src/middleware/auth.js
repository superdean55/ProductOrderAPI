import jwt from "jsonwebtoken";
import db from "../models/index.js";

export const authMiddleware = async (req, res, next) => {
  console.log("🔹 Auth middleware invoked");

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("❌ No authorization header found");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔹 Token extracted:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Token decoded:", decoded);

    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      console.log(`❌ No user found with ID: ${decoded.id}`);
      return res.status(401).json({ message: "User not found" });
    }
    console.log("🔹 User found:", user.username, "Token version:", user.tokenVersion);

    if (decoded.tokenVersion !== user.tokenVersion) {
      console.log(
        `❌ Token version mismatch: tokenVersion=${decoded.tokenVersion}, user.tokenVersion=${user.tokenVersion}`
      );
      return res.status(401).json({ message: "Token expired" });
    }

    req.user = user;
    req.userId = user.id;
    console.log("✅ Middleware passed, userId set:", req.userId);

    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

