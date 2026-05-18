const { connection } = require("../config/db.mysql");

function cloneOrder(order) {
  return order
    ? {
        ...order,
        items: order.items.map((item) => ({ ...item })),
      }
    : null;
}

async function createOrder(order) {
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute(
      `INSERT INTO orders (
        id,
        userId,
        shopperEmail,
        status,
        statusIndex,
        eta,
        subtotal,
        tax,
        shippingCost,
        total,
        deliveryMethod,
        paymentMethod,
        destination,
        notes,
        createdAt,
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order.id,
        order.userId,
        order.shopperEmail,
        order.status,
        order.statusIndex,
        order.eta,
        order.subtotal,
        order.tax,
        order.shipping,
        order.total,
        order.deliveryMethod,
        order.paymentMethod,
        order.destination,
        order.notes,
        order.createdAt,
        order.updatedAt,
      ]
    );

    for (const item of order.items) {
      await conn.execute(
        `INSERT INTO order_items (orderId, productId, quantity, priceAtPurchase)
         VALUES (?, ?, ?, ?)`,
        [order.id, item.productId, item.quantity, item.price]
      );
    }

    await conn.commit();
    return cloneOrder(order);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function findById(id) {
  const [rows] = await connection.execute("SELECT * FROM orders WHERE id = ?", [id]);
  if (rows.length === 0) return null;

  const order = rows[0];
  const [items] = await connection.execute(
    "SELECT * FROM order_items WHERE orderId = ? ORDER BY id",
    [id]
  );

  return cloneOrder({
    ...order,
    items: items.map((item) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
      price: Number(item.priceAtPurchase),
    })),
  });
}

async function listByUserId(userId) {
  const [orders] = await connection.execute(
    "SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC",
    [userId]
  );

  if (orders.length === 0) return [];

  const orderIds = orders.map((order) => order.id);
  const [items] = await connection.execute(
    `SELECT * FROM order_items WHERE orderId IN (${orderIds.map(() => "?").join(",")}) ORDER BY id`,
    orderIds
  );

  const itemsByOrder = items.reduce((acc, item) => {
    const orderId = item.orderId;
    if (!acc[orderId]) acc[orderId] = [];
    acc[orderId].push({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
      price: Number(item.priceAtPurchase),
    });
    return acc;
  }, {});

  return orders.map((order) =>
    cloneOrder({
      ...order,
      items: itemsByOrder[order.id] || [],
    })
  );
}

async function updateOrder(order) {
  await connection.execute(
    "UPDATE orders SET status = ?, statusIndex = ? WHERE id = ?",
    [order.status, order.statusIndex, order.id]
  );
  return cloneOrder(order);
}

module.exports = {
  createOrder,
  findById,
  listByUserId,
  updateOrder,
};
