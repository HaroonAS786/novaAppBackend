const cartService = require("../services/cartService");
const { sendNoContent, sendSuccess } = require("../helpers/responseHelper");

async function getCart(req, res) {
  return sendSuccess(res, 200, {
    cart: await cartService.getCart(req.user.id),
  });
}

async function addItem(req, res) {
  return sendSuccess(res, 200, {
    cart: await cartService.addItem(req.user.id, req.body),
  });
}

async function updateItem(req, res) {
  return sendSuccess(res, 200, {
    cart: await cartService.updateItem(req.user.id, req.params.productId, req.body),
  });
}

async function removeItem(req, res) {
  return sendSuccess(res, 200, {
    cart: await cartService.removeItem(req.user.id, req.params.productId),
  });
}

async function clearCart(req, res) {
  await cartService.clearCart(req.user.id);
  return sendNoContent(res);
}

module.exports = {
  addItem,
  clearCart,
  getCart,
  removeItem,
  updateItem,
};
