const express = require("express");
const productsController = require("../controllers/productsController");
const { asyncHandler } = require("../helpers/asyncHandler");
const { validate } = require("../middleware/validate");
const {
  productIdParamSchema,
  productQuerySchema,
} = require("../validators/productValidator");

const router = express.Router();

router.get(
  "/",
  validate({ query: productQuerySchema }),
  asyncHandler(productsController.listProducts)
);
router.get("/featured", asyncHandler(productsController.listFeaturedProducts));
router.get("/categories", asyncHandler(productsController.listCategories));
router.get(
  "/:id",
  validate({ params: productIdParamSchema }),
  asyncHandler(productsController.getProduct)
);

module.exports = router;
