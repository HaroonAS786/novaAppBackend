const assert = require("assert");

process.env.NODE_ENV = "test";

const app = require("../src/app");

function api(baseUrl, path, options = {}) {
  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  }).then(async (response) => {
    const text = await response.text();
    const body = text ? JSON.parse(text) : null;
    return { response, body };
  });
}

async function run() {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;

  try {
    const health = await api(baseUrl, "/health");
    assert.strictEqual(health.response.status, 200);
    assert.strictEqual(health.body.data.service, "nova-market-api");

    const login = await api(baseUrl, "/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "demo@nova.test",
        password: "password123",
      }),
    });
    assert.strictEqual(login.response.status, 200);
    assert.ok(login.body.data.token);

    const token = login.body.data.token;
    const authHeaders = { authorization: `Bearer ${token}` };

    const products = await api(baseUrl, "/products?search=audio&sort=rating");
    assert.strictEqual(products.response.status, 200);
    assert.ok(products.body.data.items.length >= 1);

    const cart = await api(baseUrl, "/cart/items", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ productId: 1, quantity: 2 }),
    });
    assert.strictEqual(cart.response.status, 200);
    assert.strictEqual(cart.body.data.cart.itemCount, 2);
    assert.strictEqual(cart.body.data.cart.subtotal, 258);

    const order = await api(baseUrl, "/orders", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        fullName: "Demo Shopper",
        email: "demo@nova.test",
        phone: "5551234567",
        address: "100 Market Street",
        city: "Austin",
        postalCode: "73301",
        deliveryMethod: "standard",
        paymentMethod: "card",
        cardName: "Demo Shopper",
        cardLast4: "4242",
        notes: "Smoke test order",
      }),
    });
    assert.strictEqual(order.response.status, 201);
    assert.ok(order.body.data.order.id.startsWith("NOVA-"));
    assert.strictEqual(order.body.data.order.total, 278.64);

    const orderId = order.body.data.order.id;
    const advanced = await api(baseUrl, `/orders/${orderId}/status`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ action: "advance" }),
    });
    assert.strictEqual(advanced.response.status, 200);
    assert.strictEqual(advanced.body.data.order.status, "Packed");

    const current = await api(baseUrl, "/orders/current", {
      headers: authHeaders,
    });
    assert.strictEqual(current.response.status, 200);
    assert.strictEqual(current.body.data.order.id, orderId);
  } finally {
    server.close();
  }
}

run()
  .then(() => console.log("Smoke test passed."))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
