const { products: productSeed } = require("./product.seed");
const { connection } = require("../config/db.mysql");

function cloneProduct(product) {
  if (!product) return null;

  return {
    ...product,
    tags: product.tags ? JSON.parse(product.tags) : [],
  };
}

async function findAll() {
  const [rows] = await connection.execute("SELECT * FROM products ORDER BY id");
  return rows.map(cloneProduct);
}

async function findById(id) {
  const [rows] = await connection.execute("SELECT * FROM products WHERE id = ?", [Number(id)]);
  return cloneProduct(rows[0]);
}

async function reduceStock(productId, quantity) {
  const [result] = await connection.execute(
    "UPDATE products SET stock = stock - ?, sold = sold + ? WHERE id = ? AND stock >= ?",
    [quantity, quantity, Number(productId), quantity]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findById(productId);
}

async function seedProducts() {
  const [rows] = await connection.execute("SELECT COUNT(*) AS count FROM products");
  if (rows[0].count > 0) return;

  const sql = `INSERT INTO products (
    id,
    name,
    brand,
    category,
    price,
    originalPrice,
    rating,
    reviews,
    stock,
    sold,
    badge,
    description,
    tags,
    imageUrl,
    imageAlt,
    accent,
    deliveryEta
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  for (const product of productSeed) {
    await connection.execute(sql, [
      product.id,
      product.name,
      product.brand ?? null,
      product.category ?? null,
      product.price ?? null,
      product.originalPrice ?? null,
      product.rating ?? null,
      product.reviews ?? null,
      product.stock ?? null,
      product.sold ?? null,
      product.badge ?? null,
      product.description ?? null,
      JSON.stringify(product.tags || []),
      product.imageUrl ?? null,
      product.imageAlt ?? null,
      product.accent ?? null,
      product.deliveryEta ?? null,
    ]);
  }
}

module.exports = {
  findAll,
  findById,
  reduceStock,
  seedProducts,
};
