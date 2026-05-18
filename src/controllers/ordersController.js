const ordersService = require("../services/orderService");
const { sendSuccess } = require("../helpers/responseHelper");

async function createOrder(req, res) {
  return sendSuccess(res, 201, {
    order: await ordersService.createOrder(req.user, req.body),
  });
}

async function listOrders(req, res) {
  return sendSuccess(res, 200, await ordersService.listOrders(req.user.id, req.query));
}

async function getCurrentOrder(req, res) {
  return sendSuccess(res, 200, {
    order: await ordersService.getCurrentOrder(
      req.user.id,
      req.query.selectedOrderId
    ),
  });
}

async function getOrder(req, res) {
  return sendSuccess(res, 200, {
    order: await ordersService.getOrder(req.user.id, req.params.id),
  });
}

async function updateStatus(req, res) {
  return sendSuccess(res, 200, {
    order: await ordersService.updateStatus(req.user, req.params.id, req.body),
  });
}

module.exports = {
  createOrder,
  getCurrentOrder,
  getOrder,
  listOrders,
  updateStatus,
};
