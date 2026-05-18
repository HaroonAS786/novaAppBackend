const { connection } = require("../config/db.mysql");

async function listItems(userId) {
  const [rows] = await connection.execute(
    "SELECT productId, quantity FROM cart_items WHERE userId = ?",
    [userId]
  );
  return rows.map((item) => ({
    productId: Number(item.productId),
    quantity: Number(item.quantity),
  }));
}

async function setItem(userId, productId, quantity) {
  if (quantity <= 0) {
    await removeItem(userId, productId);
    return null;
  }

  await connection.execute(
    `INSERT INTO cart_items (userId, productId, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
    [userId, Number(productId), Number(quantity)]
  );

  return {
    productId: Number(productId),
    quantity: Number(quantity),
  };
}

async function removeItem(userId, productId) {
  await connection.execute(
    "DELETE FROM cart_items WHERE userId = ? AND productId = ?",
    [userId, Number(productId)]
  );
}

async function clearCart(userId) {
  await connection.execute("DELETE FROM cart_items WHERE userId = ?", [userId]);
}

module.exports = {
  clearCart,
  listItems,
  removeItem,
  setItem,
};
