import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import {logger} from "../utils/logger.js";
import { APIError } from "../utils/APIError.js";

const { User } = db;

export const register = async (req, res, next ) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
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
    logger.info(`User registered: ${email}`);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      }
    });
  } catch (err) {
    logger.error("Registration error:", err);
    next(err);
  }
};

export const login = async (req, res, next) => {
  
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new APIError("Invalid credentials", 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new APIError("Invalid credentials", 400);

    const token = jwt.sign(
      { id: user.id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    logger.info(`User logged in: ${email}`);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      }
    });
  } catch (err) {
    logger.error("Login error:", err);
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {

    const user = await db.User.findByPk(req.userId);
    if (!user) throw new APIError("User not found", 404);

    user.tokenVersion++;
    await user.save();

    logger.info(`User logged out: ${user.email}`);
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });

  } catch (err) {
    logger.error("Logout error:", err);
    next(err);
  }
};
