const productsService = require("../services/productService");
const { sendSuccess } = require("../helpers/responseHelper");

async function listProducts(req, res) {
  return sendSuccess(res, 200, await productsService.getProducts(req.query));
}

async function listFeaturedProducts(req, res) {
  return sendSuccess(res, 200, {
    items: await productsService.getFeaturedProducts(),
  });
}

async function listCategories(req, res) {
  return sendSuccess(res, 200, {
    items: await productsService.getCategories(),
  });
}

async function getProduct(req, res) {
  return sendSuccess(res, 200, {
    product: await productsService.getProductById(req.params.id),
  });
}

module.exports = {
  listProducts,
  listFeaturedProducts,
  listCategories,
  getProduct,
};
