import { cloudinary } from "../config/cloudinary.js";
import { logger } from "../utils/logger.js";
import { APIError } from "../utils/APIError.js";

export const uploadToCloudinary = async (buffer, options = {}) => {
  try {
    return await new Promise((resolve, reject) => {
      const folder = options.folder || "default";
      const uploadStream = cloudinary.uploader.upload_stream(
        { ...options, folder },
        (error, result) => {
          if (error) {
            return reject(new APIError("Image upload failed", 500));
          }
          
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
  } catch (err) {
    throw new APIError("Unexpected error uploading image", 500);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    return await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(new APIError("Failed to delete image", 500));
        }
        logger.info(`Image deleted from Cloudinary: ${publicId}`);
        resolve(result);
      });
    });
  } catch (err) {
    throw new APIError("Unexpected error deleting image", 500);
  }
};
