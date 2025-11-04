import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/cloudinaryService.js";
import { APIError } from "../utils/APIError.js";
import { logger } from "../utils/logger.js";
import { successResponse } from "../utils/response.js";
import sequelize from "../config/database.js";

export const uploadUserImage = async (req, res, next) => {
  try {
    if (!req.file) throw new APIError("No image file provided", 400);

    const oldPublicId = req.user.imageId || null;

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "users",
    });

    try {
      req.user.imageId = result.public_id;
      req.user.imageUrl = result.secure_url;
      await req.user.save();
    } catch (dbError) {
      await deleteFromCloudinary(result.public_id);
      throw new APIError("Failed to update user image data to database", 500, null, dbError);
    }

    logger.info(
      `User ${req.user.id} updated profile image: ${result.public_id}`
    );

    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId);
      logger.info(`Old image ${oldPublicId} deleted for user ${req.user.id}`);
    }

    successResponse(
      res,
      "Profile image updated successfully",
      { imageId: result.public_id, imageUrl: result.secure_url },
      200
    );
  } catch (err) {
    next(err);
  }
};

export const deleteUserImage = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const publicId = req.user.imageId;
    if (!publicId) throw new APIError("No image to delete", 400);
    
    req.user.imageId = null;
    req.user.imageUrl = null;
    await req.user.save({ transaction: t }).catch((dbError) => {
      throw new APIError("Failed to delete user image data from database", 500, null, dbError);
    });

    try {
      await deleteFromCloudinary(publicId);
    } catch (err) {
      await t.rollback();
    }

    await t.commit();

    logger.info(`User ${req.user.id} deleted profile image: ${publicId}`);
    successResponse(res, "Profile image deleted successfully", null, 200);
  } catch (err) {

    if (!t.finished) await t.rollback();
    next(err);
  }
};