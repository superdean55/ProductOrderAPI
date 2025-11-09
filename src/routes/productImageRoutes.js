import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  uploadProductImage,
  deleteProductImage,
} from "../controllers/productImageController.js";
import { isValidJsonBody } from "../middleware/isValidJsonBody.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.put(
  "/:id/image",
  isValidJsonBody,
  authMiddleware,
  upload.single("image"),
  uploadProductImage
);
router.delete("/:id/image", authMiddleware, deleteProductImage);

export default router;
