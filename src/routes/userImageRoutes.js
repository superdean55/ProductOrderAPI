import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  uploadUserImage,
  deleteUserImage,
} from "../controllers/userImageController.js";
import { isValidJsonBody } from "../middleware/isValidJsonBody.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.put(
  "/me/image",
  isValidJsonBody,
  authMiddleware,
  upload.single("image"),
  uploadUserImage
);
router.delete("/me/image", authMiddleware, deleteUserImage);

export default router;
