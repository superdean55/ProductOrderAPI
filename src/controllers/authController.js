import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import { logger } from "../utils/logger.js";
import { APIError } from "../utils/APIError.js";
import { successResponse } from "../utils/response.js";

const { User } = db;

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      where: { email },
      attributes: { exclude: ["password", "tokenVersion", "imageId"] },
    });
    if (existingUser) {
      throw new APIError("Email already in use", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user.id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    logger.info(`User [id:${user.id}] registered\nUser email:${user.email}`);
    successResponse(res, "User registered successfully", { user, token }, 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["password", "tokenVersion", "imageId"] },
    });
    if (!user) throw new APIError("Invalid credentials", 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new APIError("Invalid credentials", 400);

    const token = jwt.sign(
      { id: user.id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    logger.info(`User logged in: ${email}`);
    successResponse(res, "Login successful", { user, token }, 200);
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
