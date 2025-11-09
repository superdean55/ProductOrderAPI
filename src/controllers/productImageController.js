import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/cloudinaryService.js";
import { APIError } from "../utils/APIError.js";
import { logger } from "../utils/logger.js";
import { successResponse } from "../utils/response.js";
import db from "../models/index.js";
import validator from "validator";
const { Product, sequelize } = db;

export const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) throw new APIError("No image file provided", 400);

    const { productId } = req.params;
    if (!productId || !validator.isUUID(productId, 4))
          throw new APIError("Product ID is required", 400);

    const product = await Product.findByPk(productId);
    if (!product) throw new APIError("Product not found", 404);

    const oldPublicId = product.imageId || null;

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "products",
    });

    try {
      product.imageId = result.public_id;
      product.imageUrl = result.secure_url;
      await product.save();
    } catch (dbError) {
      await deleteFromCloudinary(result.public_id);
      throw new APIError(
        "Failed to update product image data in database",
        500,
        null,
        dbError
      );
    }

    logger.info(`Product ${product.id} updated image: ${result.public_id}`);

    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId);
      logger.info(`Old image ${oldPublicId} deleted for product ${product.id}`);
    }

    successResponse(
      res,
      "Product image updated successfully",
      { imageId: result.public_id, imageUrl: result.secure_url },
      200
    );
  } catch (err) {
    next(err);
  }
};


export const deleteProductImage = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { productId } = req.params;
    if (!productId || !validator.isUUID(productId, 4))
          throw new APIError("Product ID is required", 400);

    const product = await Product.findByPk(productId);
    if (!product) throw new APIError("Product not found", 404);

    const publicId = product.imageId;
    if (!publicId) throw new APIError("No image to delete", 400);

    product.imageId = null;
    product.imageUrl = null;

    await product.save({ transaction: t });

    try {
      await deleteFromCloudinary(publicId);
    } catch (cloudErr) {
      await t.rollback();
      throw new APIError(
        "Failed to delete image from Cloudinary",
        500,
        null,
        cloudErr
      );
    }

    await t.commit();

    logger.info(`Product ${product.id} deleted image: ${publicId}`);
    successResponse(res, "Product image deleted successfully", null, 200);
  } catch (err) {
    if (!t.finished) await t.rollback();
    next(err);
  }
};
