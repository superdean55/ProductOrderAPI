import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinaryService.js";
import { APIError } from "../utils/APIError.js";
import { logger } from "../utils/logger.js";

export const uploadUserImage = async (req, res, next) => {
  try {
    if (!req.file) throw new APIError("No image file provided", 400);

    const result = await uploadToCloudinary(req.file.buffer, { folder: "users" });

    req.user.imageId = result.public_id;
    req.user.imageUrl = result.secure_url;
    await req.user.save(); 

    logger.info(`User ${req.user.id} uploaded profile image: ${result.public_id}`);

    return res.status(201).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: {
        imageId: result.public_id,
        imageUrl: result.secure_url,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserImage = async (req, res, next) => {
  try {
    if (!req.file) throw new APIError("No image file provided", 400);

    const oldPublicId = req.user.imageId || null;

    const result = await uploadToCloudinary(req.file.buffer, { folder: "users" });

    req.user.imageId = result.public_id;
    req.user.imageUrl = result.secure_url;
    await req.user.save();

    logger.info(`User ${req.user.id} updated profile image: ${result.public_id}`);

    if (oldPublicId) {
      try {
        await deleteFromCloudinary(oldPublicId);
        logger.info(`Old image ${oldPublicId} deleted for user ${req.user.id}`);
      } catch (delErr) {
        logger.error(`Failed to delete old image ${oldPublicId} for user ${req.user.id}: ${delErr.message}`, { stack: delErr.stack });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: {
        imageId: result.public_id,
        imageUrl: result.secure_url,
      },
    });
  } catch (err) {
    next(err);
  }
};


export const deleteUserImage = async (req, res, next) => {
  try {
    const publicId = req.user.imageId;
    if (!publicId) {
      throw new APIError("No image to delete", 400);
    }

    await deleteFromCloudinary(publicId);

    req.user.imageId = null;
    req.user.imageUrl = null;
    await req.user.save();

    logger.info(`User ${req.user.id} deleted profile image: ${publicId}`);

    return res.status(200).json({
      success: true,
      message: "Profile image deleted successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
