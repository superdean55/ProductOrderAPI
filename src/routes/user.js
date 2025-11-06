import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { updateUserSchema } from "../validators/userValidator.js";
import { isValidJsonBody } from "../middleware/isValidJsonBody.js";
const router = express.Router();

router.get("/me", authMiddleware, getUser);
router.put(
  "/me",
  isValidJsonBody,
  authMiddleware,
  validate(updateUserSchema),
  updateUser
);
router.delete("/me", authMiddleware, deleteUser);

export default router;
