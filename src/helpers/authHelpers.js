import db from "../models/index.js";
import jwt from "jsonwebtoken";
import { APIError } from "../utils/APIError.js";

const { User } = db;

export const validateUniqueEmail = async (email) => {
  const existingUser = await User.findOne({
    where: { email },
    paranoid: false,
  });

  if (existingUser) {
    throw new APIError("Email is already in use", 400);
  }
};

export const validateUniqueUsername = async (username) => {
  const existingUser = await User.findOne({
    where: { username },
    paranoid: false,
  });

  if (existingUser) {
    throw new APIError("Username is already in use", 400);
  }
};

export const getToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      tokenVersion: user.tokenVersion,
      role: user.role, 
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};