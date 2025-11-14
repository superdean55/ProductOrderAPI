import db from "../models/index.js";
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
