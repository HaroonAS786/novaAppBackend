const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/app.config");
const { createError } = require("../helpers/errorHelper");
const userModel = require("../models/user.model");

function toSafeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

async function signup(payload) {
  const email = payload.email.toLowerCase();

  if (payload.password !== payload.confirmPassword) {
    throw createError(400, "VALIDATION_ERROR", "Passwords do not match.");
  }

  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw createError(409, "EMAIL_EXISTS", "Email already exists.");
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await userModel.createUser({
    name: payload.name.trim(),
    email,
    passwordHash,
  });

  return {
    user: toSafeUser(user),
    token: signToken(user),
  };
}

async function login(payload) {
  const user = await userModel.findByEmail(payload.email);

  if (!user) {
    throw createError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);

  if (!passwordMatches) {
    throw createError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
  }

  return {
    user: toSafeUser(user),
    token: signToken(user),
  };
}

function me(user) {
  return {
    user: toSafeUser(user),
  };
}

module.exports = {
  signup,
  login,
  me,
  toSafeUser,
};
