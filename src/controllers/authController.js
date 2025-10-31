import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import {logger} from "../utils/logger.js";
import { ApiError } from "../middleware/errorHandler.js"; 

const { User } = db;

export const register = async (req, res, next ) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError(400, "Email already in use");
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
    res.status(201).json({ user: { id: user.id, username, email }, token });
  } catch (err) {
    logger.error("Registration error:", err);
    next(err);
  }
};

export const login = async (req, res, next) => {
  
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new ApiError(400, "Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(400, "Invalid credentials");

    const token = jwt.sign(
      { id: user.id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    logger.info(`User logged in: ${email}`);
    res.json({ user: { id: user.id, username: user.username, email }, token });
  } catch (err) {
    logger.error("Login error:", err);
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.userId);
    if (!user) throw new ApiError(404, "User not found");
    user.tokenVersion++;
    await user.save();
    logger.info(`User logged out: ${user.email}`);
    res.json({ message: "User logged out successfully" });
  } catch (err) {
    logger.error("Logout error:", err);
    next(err);
  }
};
