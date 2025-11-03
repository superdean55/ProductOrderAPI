import { APIError } from "../utils/APIError.js";
import { logger } from "../utils/logger.js";
import { successResponse } from "../utils/response.js";
import db from "../models/index.js";

const { User } = db;

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) throw new APIError("User not found", 404);

    logger.info(`User [id=${req.user.id}] retrieved their profile data`);

    successResponse(res, "User data retrieved successfully", { user }, 200);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) throw new APIError("User not found", 404);

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save().catch(() => {
      throw new APIError("Failed to save user data to the database", 500);
    });

    logger.info(`User [id=${req.user.id}] updated their profile data`);
    successResponse(
      res,
      "User updated successfully",
      {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          imageUrl: user.imageUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      200
    );
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) throw new APIError("User not found", 404);

    await user.destroy().catch(() => {
      throw new APIError("Failed to delete user data from the database", 500);
    });

    logger.info(`User [id=${req.user.id}] deleted their profile data`);
    successResponse(res, "User deleted successfully", null, 200);
  } catch (err) {
    next(err);
  }
};
