import { APIError } from "../utils/APIError.js";
import { logger } from "../utils/logger.js";
import { successResponse } from "../utils/response.js";
import {
  validateUniqueEmail,
  validateUniqueUsername,
} from "../helpers/userHelpers.js";
import validator from "validator";
import db from "../models/index.js";
import { UserDTO } from "../dtos/userDto.js";
const { User } = db;

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password", "tokenVersion", "imageId"] },
    });

    if (!user) throw new APIError("User not found", 404);

    logger.info(`User [id=${req.user.id}] retrieved their profile data`);

    const userDto = UserDTO.fromModel(user);
    successResponse(
      res,
      "User data retrieved successfully",
      { user: userDto },
      200
    );
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, dateOfBirth } = req.body;

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password", "tokenVersion", "imageId"] },
    });
    if (!user) throw new APIError("User not found", 404);

    let dob;
    if (dateOfBirth !== undefined) {
      dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        throw new APIError("Invalid dateOfBirth format", 400);
      }
    }

    const updates = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
    if (dob !== undefined) updates.dateOfBirth = dob;

    if (Object.keys(updates).length === 0) {
      return successResponse(res, "No changes detected", { user }, 200);
    }
    const updatedUser = await user.update(updates);

    logger.info(`User [id=${req.user.id}] updated their profile data`);
    const userDto = UserDTO.fromModel(updatedUser);
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

export const restoreUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !validator.isUUID(id, 4))
      throw new APIError("User ID is required", 400);

    const user = await User.findByPk(id, { paranoid: false });
    if (!user) throw new APIError("User not found", 404);

    if (user.deletedAt === null)
      throw new APIError(
        "The user cannot be recovered because it is active",
        400
      );
    await user.restore();

    logger.info(`User [id=${user.id}] has been restored`);

    const userDto = UserDTO.fromModel(user);
    successResponse(res, "User restored successfully", { user: userDto }, 200);
  } catch (err) {
    next(err);
  }
};
