const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const { createError } = require("../helpers/errorHelper");
const { calculateTotals, roundMoney } = require("../helpers/pricingHelper");

async function expandCart(userId, deliveryMethod = "standard") {
  const items = await cartModel.listItems(userId);

  const expanded = await Promise.all(
    items.map(async (item) => {
      const product = await productModel.findById(item.productId);

      if (!product) return null;

      const originalPrice = product.originalPrice ?? product.price;

      return {
        productId: item.productId,
        quantity: item.quantity,
        product,
        lineTotal: roundMoney(product.price * item.quantity),
        originalLineTotal: roundMoney(originalPrice * item.quantity),
        savings: roundMoney((originalPrice - product.price) * item.quantity),
      };
    })
  );

  const filteredItems = expanded.filter(Boolean);
  const totals = calculateTotals(filteredItems, deliveryMethod);

  return {
    items: filteredItems,
    itemCount: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
    ...totals,
  };
}

async function getCart(userId) {
  return expandCart(userId);
}

async function addItem(userId, payload) {
  const product = await productModel.findById(payload.productId);

  if (!product) {
    throw createError(404, "PRODUCT_NOT_FOUND", "Product not found.");
  }

  if (product.stock <= 0) {
    throw createError(409, "OUT_OF_STOCK", "Product is out of stock.");
  }

  const items = await cartModel.listItems(userId);
  const currentItem = items.find((item) => item.productId === product.id);
  const currentQuantity = currentItem ? currentItem.quantity : 0;
  const nextQuantity = Math.min(currentQuantity + payload.quantity, product.stock);

  await cartModel.setItem(userId, product.id, nextQuantity);

  return getCart(userId);
}

async function updateItem(userId, productId, payload) {
  const product = await productModel.findById(productId);

  if (!product) {
    throw createError(404, "PRODUCT_NOT_FOUND", "Product not found.");
  }

  if (payload.quantity <= 0) {
    await cartModel.removeItem(userId, product.id);
    return getCart(userId);
  }

  if (payload.quantity > product.stock) {
    throw createError(
      409,
      "STOCK_CONFLICT",
      `Only ${product.stock} item(s) are available.`
    );
  }

  await cartModel.setItem(userId, product.id, payload.quantity);

  return getCart(userId);
}

async function removeItem(userId, productId) {
  const product = await productModel.findById(productId);

  if (!product) {
    throw createError(404, "PRODUCT_NOT_FOUND", "Product not found.");
  }

  await cartModel.removeItem(userId, product.id);

  return getCart(userId);
}

async function clearCart(userId) {
  await cartModel.clearCart(userId);
}

module.exports = {
  addItem,
  clearCart,
  expandCart,
  getCart,
  removeItem,
  updateItem,
};
