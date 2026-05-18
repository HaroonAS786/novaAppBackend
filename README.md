# novaAppbackend

NOVA Market backend API built as a separate Node.js/Express project from the boilerplate.

## Base URL

```text
http://localhost:3000/api/v1
```

## Setup

```bash
cp env.sample .env
npm install
npm run dev
```

This version establishes a MySQL connection pool at startup. Make sure your `.env` contains:

- `DB_HOST_NAME`
- `DB_USER_NAME`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`
- `DB_CONNECTION_LIMIT` or `CONNECTION_TIMEOUT`

If your MySQL server is running on the default local port, use `DB_PORT=3306`.

Use the demo account:

```text
demo@nova.test / password123
```

## Scripts

```bash
npm start
npm run dev
npm test
```

## API

- `GET /api/v1/health`
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `GET /api/v1/products`
- `GET /api/v1/products/featured`
- `GET /api/v1/products/categories`
- `GET /api/v1/products/:id`
- `GET /api/v1/cart`
- `POST /api/v1/cart/items`
- `PATCH /api/v1/cart/items/:productId`
- `DELETE /api/v1/cart/items/:productId`
- `DELETE /api/v1/cart`
- `POST /api/v1/orders`
- `GET /api/v1/orders`
- `GET /api/v1/orders/current`
- `GET /api/v1/orders/:id`
- `PATCH /api/v1/orders/:id/status`
- `GET /api/v1/store`

## Storage

This first version uses in-memory storage seeded at startup:

- Demo user: `demo@nova.test`
- 12 NOVA Market products
- Per-user carts
- Per-user orders

For production, replace the model files with database-backed persistence while keeping the route and service contracts stable.
