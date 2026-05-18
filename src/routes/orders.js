const express = require("express");
const ordersController = require("../controllers/ordersController");
const { asyncHandler } = require("../helpers/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  checkoutSchema,
  currentOrderQuerySchema,
  orderIdParamSchema,
  orderListQuerySchema,
  statusUpdateSchema,
} = require("../validators/orderValidator");

const router = express.Router();

router.use(requireAuth);

router.post(
  "/",
  validate({ body: checkoutSchema }),
  asyncHandler(ordersController.createOrder)
);
router.get(
  "/",
  validate({ query: orderListQuerySchema }),
  asyncHandler(ordersController.listOrders)
);
router.get(
  "/current",
  validate({ query: currentOrderQuerySchema }),
  asyncHandler(ordersController.getCurrentOrder)
);
router.get(
  "/:id",
  validate({ params: orderIdParamSchema }),
  asyncHandler(ordersController.getOrder)
);
router.patch(
  "/:id/status",
  validate({ params: orderIdParamSchema, body: statusUpdateSchema }),
  asyncHandler(ordersController.updateStatus)
);

module.exports = router;
