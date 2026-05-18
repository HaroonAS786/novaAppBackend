const crypto = require("crypto");
const cartService = require("./cartService");
const productModel = require("../models/product.model");
const orderModel = require("../models/order.model");
const config = require("../config/app.config");
const { createError } = require("../helpers/errorHelper");
const { ORDER_STATUSES } = require("../constants/orderStatuses");

const DELIVERY_DAYS = {
  express: 2,
  standard: 4,
  scheduled: 6,
};

function createOrderId() {
  const suffix = crypto.randomInt(1000000, 9999999);
  return `NOVA-${suffix}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

function newestFirst(a, b) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

async function assertStockAvailable(cart) {
  for (const item of cart.items) {
    const product = await productModel.findById(item.productId);

    if (!product) {
      throw createError(404, "PRODUCT_NOT_FOUND", "Product not found.");
    }

    if (item.quantity > product.stock) {
      throw createError(
        409,
        "STOCK_CONFLICT",
        `${product.name} only has ${product.stock} item(s) available.`
      );
    }
  }
}

async function createOrder(user, payload) {
  const cart = await cartService.expandCart(user.id, payload.deliveryMethod);

  if (cart.items.length === 0) {
    throw createError(400, "EMPTY_CART", "Cart is empty.");
  }

  await assertStockAvailable(cart);

  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const eta = addDays(now, DELIVERY_DAYS[payload.deliveryMethod]);
  const order = {
    id: createOrderId(),
    userId: user.id,
    shopperEmail: payload.email,
    createdAt: now,
    updatedAt: now,
    eta,
    status: ORDER_STATUSES[0],
    statusIndex: 0,
    items: cart.items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      brand: item.product.brand,
      imageUrl: item.product.imageUrl,
      price: item.product.price,
      quantity: item.quantity,
    })),
    subtotal: cart.subtotal,
    shipping: cart.shipping,
    tax: cart.tax,
    total: cart.total,
    deliveryMethod: payload.deliveryMethod,
    paymentMethod: payload.paymentMethod,
    destination: `${payload.address}, ${payload.city} ${payload.postalCode}`,
    notes: payload.notes || "",
  };

  for (const item of cart.items) {
    await productModel.reduceStock(item.productId, item.quantity);
  }

  await cartService.clearCart(user.id);

  return orderModel.createOrder(order);
}

async function getUserOrders(userId) {
  const orders = await orderModel.listByUserId(userId);
  return orders.sort(newestFirst);
}

function buildSummary(orders) {
  return {
    totalOrders: orders.length,
    activeOrders: orders.filter((order) => order.status !== "Delivered").length,
    completedOrders: orders.filter((order) => order.status === "Delivered").length,
  };
}

async function listOrders(userId, query) {
  const allOrders = await getUserOrders(userId);
  const status = query.status;
  let items = allOrders;

  if (status === "active") {
    items = items.filter((order) => order.status !== "Delivered");
  } else if (status === "completed") {
    items = items.filter((order) => order.status === "Delivered");
  } else if (status) {
    items = items.filter((order) => order.status === status);
  }

  return {
    items,
    summary: buildSummary(allOrders),
  };
}

async function getCurrentOrder(userId, selectedOrderId) {
  const orders = await getUserOrders(userId);

  if (selectedOrderId) {
    const selected = orders.find((order) => order.id === selectedOrderId);
    if (selected) return selected;
  }

  return orders.find((order) => order.status !== "Delivered") || orders[0] || null;
}

async function getOrder(userId, orderId) {
  const order = await orderModel.findById(orderId);

  if (!order) {
    throw createError(404, "ORDER_NOT_FOUND", "Order not found.");
  }

  if (order.userId !== userId) {
    throw createError(403, "FORBIDDEN", "You cannot access this order.");
  }

  return order;
}

async function updateStatus(user, orderId, payload) {
  if (config.nodeEnv === "production" && user.id !== "usr_demo") {
    throw createError(403, "FORBIDDEN", "Order status updates are disabled.");
  }

  const order = await getOrder(user.id, orderId);

  if (payload.action === "advance") {
    order.statusIndex = Math.min(order.statusIndex + 1, ORDER_STATUSES.length - 1);
    order.status = ORDER_STATUSES[order.statusIndex];
  } else if (payload.status) {
    order.statusIndex = ORDER_STATUSES.indexOf(payload.status);
    order.status = payload.status;
  } else {
    throw createError(400, "VALIDATION_ERROR", "Provide an action or status.");
  }

  return orderModel.updateOrder(order);
}

module.exports = {
  createOrder,
  getCurrentOrder,
  getOrder,
  listOrders,
  updateStatus,
};
