import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateUser,
  deleteUser,
  logoutUser
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  registerUserValidator,
  loginUserValidator,
  updateUserValidator,
} from "../validators/userValidator.js";

const router = express.Router();

router.post("/register", registerUserValidator, registerUser);
router.post("/login", loginUserValidator, loginUser);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateUserValidator, updateUser);
router.delete("/delete", authMiddleware, deleteUser);
router.post("/logout", authMiddleware, logoutUser);

export default router;
