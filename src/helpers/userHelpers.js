import { APIError } from "../utils/APIError.js";
import db from "../models/index.js";

const { User } = db;

export const validateUniqueEmail = async (userId, email) => {
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser && String(existingUser.id) !== String(userId)) {
    throw new APIError("Email is already in use by another user", 400);
  }
};

export const validateUniqueUsername = async (userId, username) => {
  const existingUser = await User.findOne({ where: { username } });
  
  if (existingUser && String(existingUser.id) !== String(userId)) {
    throw new APIError("Username is already in use by another user", 400);
  }
};