const express = require("express");
const { sendSuccess } = require("../helpers/responseHelper");
const { ORDER_STATUSES } = require("../constants/orderStatuses");

const router = express.Router();

router.get("/", (req, res) =>
  sendSuccess(res, 200, {
    name: "NOVA Market",
    orderStatuses: ORDER_STATUSES,
    checkoutSteps: ["details", "delivery", "payment", "review"],
    deliveryMethods: ["standard", "express", "scheduled"],
    paymentMethods: ["card", "wallet", "cod"],
  })
);

module.exports = router;
