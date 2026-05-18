const express = require("express");
const cartController = require("../controllers/cartController");
const { asyncHandler } = require("../helpers/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  addItemSchema,
  productIdParamSchema,
  updateItemSchema,
} = require("../validators/cartValidator");

const router = express.Router();

router.use(requireAuth);

router.get("/", asyncHandler(cartController.getCart));
router.post(
  "/items",
  validate({ body: addItemSchema }),
  asyncHandler(cartController.addItem)
);
router.patch(
  "/items/:productId",
  validate({ params: productIdParamSchema, body: updateItemSchema }),
  asyncHandler(cartController.updateItem)
);
router.delete(
  "/items/:productId",
  validate({ params: productIdParamSchema }),
  asyncHandler(cartController.removeItem)
);
router.delete("/", asyncHandler(cartController.clearCart));

module.exports = router;
