import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser,getProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/register",
  body("username").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  registerUser
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  loginUser
);

router.get("/profile", authMiddleware, getProfile);

export default router;
