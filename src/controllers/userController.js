import { APIError } from "../utils/APIError.js";
import { logger } from "../utils/logger.js";
import { successResponse } from "../utils/response.js";
import {
  validateUniqueEmail,
  validateUniqueUsername,
} from "../helpers/userHelpers.js";
import db from "../models/index.js";
import { UserDTO } from "../dtos/user.dto.js";
const { User } = db;

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password", "tokenVersion", "imageId"] },
    });

    if (!user) throw new APIError("User not found", 404);

    logger.info(`User [id=${req.user.id}] retrieved their profile data`);

    const userDto = UserDTO.fromModel(user)
    successResponse(res, "User data retrieved successfully", { user: userDto }, 200);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password", "tokenVersion", "imageId"] },
    });
    if (!user) throw new APIError("User not found", 404);

    const updates = {};

    if (email && email !== user.email) {
      await validateUniqueEmail(user.id, email);
      updates.username = username;
    }
    if (username && username !== user.username) {
      await validateUniqueUsername(user.id, username);
      updates.email = email;
    }

    if (Object.keys(updates).length === 0) {
      return successResponse(res, "No changes detected", { user }, 200);
    }

    const updatedUser = await user.update(updates).catch((dbErr) => {
      throw new APIError(
        "Failed to save user data to the database",
        500,
        null,
        dbErr
      );
    });

    logger.info(`User [id=${req.user.id}] updated their profile data`);
    const userDto = UserDTO.fromModel(updatedUser)
    successResponse(
      res,
      "User updated successfully",
      {
        user: userDto,
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

    await user.destroy().catch((dbErr) => {
      throw new APIError(
        "Failed to delete user data from the database",
        500,
        null,
        dbErr
      );
    });

    logger.info(`User [id=${req.user.id}] deleted their profile data`);
    successResponse(res, "User deleted successfully", null, 200);
  } catch (err) {
    next(err);
  }
};
