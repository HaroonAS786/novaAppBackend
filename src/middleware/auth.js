const jwt = require("jsonwebtoken");
const config = require("../config/app.config");
const { createError } = require("../helpers/errorHelper");
const userModel = require("../models/user.model");
const messages = require("../constants/appMessages");

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(createError(401, "UNAUTHORIZED", messages.AUTH_REQUIRED));
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await userModel.findById(payload.sub);

    if (!user) {
      return next(createError(401, "UNAUTHORIZED", messages.AUTH_REQUIRED));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(createError(401, "UNAUTHORIZED", messages.AUTH_REQUIRED));
  }
}

module.exports = { requireAuth };
