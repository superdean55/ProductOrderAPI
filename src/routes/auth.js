import express from "express";
import { register, login, logout, changePassword, changeEmail } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema, changePasswordSchema, changeEmailSchema } from "../validators/authValidator.js";
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
router.put(
  "/change-email",
  isValidJsonBody,
  authMiddleware,
  validate(changeEmailSchema),
  changeEmail
);

export default router;
