const express = require("express");
const authRoutes = require("../routes/auth");
const productRoutes = require("../routes/products");
const cartRoutes = require("../routes/cart");
const orderRoutes = require("../routes/orders");
const storeRoutes = require("../routes/store");
const { createError } = require("../helpers/errorHelper");
const { sendSuccess } = require("../helpers/responseHelper");
const { errorHandler } = require("../middleware/error");

function healthHandler(req, res) {
  return sendSuccess(res, 200, {
    status: "ok",
    service: "nova-market-api",
  });
}

module.exports = function registerRoutes(app) {
  const apiRouter = express.Router();

  app.use(express.json());

  apiRouter.get("/health", healthHandler);
  apiRouter.use("/auth", authRoutes);
  apiRouter.use("/products", productRoutes);
  apiRouter.use("/cart", cartRoutes);
  apiRouter.use("/orders", orderRoutes);
  apiRouter.use("/store", storeRoutes);

  app.get("/", healthHandler);
  app.get("/health", healthHandler);
  app.use("/api/v1", apiRouter);

  app.use((req, res, next) => {
    next(createError(404, "NOT_FOUND", "Route not found."));
  });

  app.use(errorHandler);
};
