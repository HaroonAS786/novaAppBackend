const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { connection } = require("../config/db.mysql");

function cloneUser(user) {
  return user ? { ...user } : null;
}

async function findById(id) {
  const [rows] = await connection.execute("SELECT * FROM users WHERE id = ?", [id]);
  return rows.length > 0 ? cloneUser(rows[0]) : null;
}

async function findByEmail(email) {
  const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [
    email.toLowerCase(),
  ]);
  return rows.length > 0 ? cloneUser(rows[0]) : null;
}

async function createUser({ name, email, passwordHash }) {
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const id = `usr_${crypto.randomUUID().slice(0, 8)}`;

  const user = {
    id,
    name,
    email: email.toLowerCase(),
    passwordHash,
    createdAt: now,
    updatedAt: now,
  };

  await connection.execute(
    "INSERT INTO users (id, name, email, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
    [user.id, user.name, user.email, user.passwordHash, user.createdAt, user.updatedAt]
  );

  return cloneUser(user);
}

async function seedDemoUser() {
  const existingDemo = await findByEmail("demo@nova.test");
  if (existingDemo) return;

  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  await connection.execute(
    "INSERT INTO users (id, name, email, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
    [
      "usr_demo",
      "Demo Shopper",
      "demo@nova.test",
      bcrypt.hashSync("password123", 10),
      now,
      now,
    ]
  );
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  seedDemoUser,
};
