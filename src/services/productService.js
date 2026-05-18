const productModel = require("../models/product.model");
const { createError } = require("../helpers/errorHelper");

const SORTERS = {
  featured: (a, b) => b.sold - a.sold,
  "price-low": (a, b) => a.price - b.price,
  "price-high": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  newest: (a, b) => b.id - a.id,
};

function normalizeBoolean(value) {
  return value === true || value === "true" || value === "1";
}

function matchesSearch(product, search) {
  if (!search) return true;

  const term = search.toLowerCase();
  const searchable = [
    product.name,
    product.brand,
    product.category,
    product.description,
    ...product.tags,
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(term);
}

async function categoryNames() {
  const products = await productModel.findAll();
  return ["All", ...Array.from(new Set(products.map((product) => product.category)))];
}

async function getProducts(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.max(Number(query.limit) || 24, 1);
  const sort = SORTERS[query.sort] ? query.sort : "featured";
  const category = query.category || "All";
  const inStockOnly = normalizeBoolean(query.inStockOnly);

  let items = await productModel.findAll();

  if (category && category.toLowerCase() !== "all") {
    items = items.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  items = items.filter((product) => matchesSearch(product, query.search));

  if (inStockOnly) {
    items = items.filter((product) => product.stock > 0);
  }

  items = [...items].sort(SORTERS[sort]);

  const total = items.length;
  const start = (page - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    meta: {
      page,
      limit,
      total,
      categories: await categoryNames(),
    },
  };
}

async function getFeaturedProducts() {
  const items = await productModel.findAll();
  return items.sort(SORTERS.featured).slice(0, 4);
}

async function getCategories() {
  const products = await productModel.findAll();
  const counts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  return [
    { name: "All", count: products.length },
    ...((await categoryNames())
      .filter((name) => name !== "All")
      .map((name) => ({ name, count: counts[name] || 0 }))),
  ];
}

async function getProductById(id) {
  const product = await productModel.findById(id);

  if (!product) {
    throw createError(404, "PRODUCT_NOT_FOUND", "Product not found.");
  }

  return product;
}

module.exports = {
  getProducts,
  getFeaturedProducts,
  getCategories,
  getProductById,
};
