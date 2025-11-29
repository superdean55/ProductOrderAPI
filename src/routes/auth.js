import express from "express";
import { register, login, logout, changePassword } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema, changePasswordSchema } from "../validators/authValidator.js";
import { isValidJsonBody } from "../middleware/isValidJsonBody.js";


const router = express.Router();

router.post("/register", isValidJsonBody, validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", authMiddleware, logout);
router.put(
  "/change-password",
  isValidJsonBody,
  authMiddleware,
  validate(changePasswordSchema),
  changePassword
);

export default router;
