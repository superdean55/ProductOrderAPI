import express from "express";
import {
  getProfile,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  updateUserValidator,
} from "../validators/userValidator.js";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateUserValidator, updateUser);
router.delete("/me", authMiddleware, deleteUser);

export default router;
