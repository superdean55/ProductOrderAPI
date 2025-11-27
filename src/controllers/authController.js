import bcrypt from "bcrypt";
import db from "../models/index.js";
import { logger } from "../utils/logger.js";
import { APIError } from "../utils/APIError.js";
import { successResponse } from "../utils/response.js";
import { UserDTO } from "../dtos/userDto.js";
import {
  validateUniqueEmail,
  validateUniqueUsername,
  getToken,
} from "../helpers/authHelpers.js";

const { User } = db;

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    await validateUniqueEmail(email);
    await validateUniqueUsername(username);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    logger.info(`User [id:${user.id}] registered\nUser email:${user.email}`);

    const token = getToken(user);

    const userDto = UserDTO.fromModel(user);
    successResponse(
      res,
      "User registered successfully",
      {
        user: userDto,
        token,
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
    });
    if (!user) throw new APIError("Invalid credentials", 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new APIError("Invalid credentials", 400);

    const token = getToken(user);

    logger.info(`User logged in: ${email}`);
    const userDto = UserDTO.fromModel(user);
    successResponse(
      res,
      "Login successful",
      {
        user: userDto,
        token,
      },
      200
    );
  } catch (err) {
    logger.error("Login error:", err);
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.user.id);
    if (!user) throw new APIError("User not found", 404);

    user.tokenVersion++;
    await user.save();

    logger.info(`User logged out: ${user.email}`);
    successResponse(res, "User logged out successfully", null, 200);
  } catch (err) {
    logger.error("Logout error:", err);
    next(err);
  }
};
