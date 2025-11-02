import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  uploadUserImage,
  updateUserImage,
  deleteUserImage
} from "../controllers/userImageController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/me/image", authMiddleware, upload.single("image"), uploadUserImage);
router.put("/me/image", authMiddleware, upload.single("image"), updateUserImage);
router.delete("/me/image", authMiddleware, deleteUserImage);

export default router;
