const mySql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const dbPort = Number(process.env.DB_PORT) || 3306;
const connectionLimit =
  Number(process.env.DB_CONNECTION_LIMIT ?? process.env.CONNECTION_TIMEOUT) || 10;
const waitForConnections =
  process.env.WAIT_FOR_CONNECTIONS !== undefined
    ? /^(true|1)$/i.test(process.env.WAIT_FOR_CONNECTIONS)
    : true;

const connection = mySql.createPool({
  host: process.env.DB_HOST_NAME || "127.0.0.1",
  user: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: dbPort,
  waitForConnections,
  connectionLimit,
});

/**
 * checkSQLConnection
 * ------------------------------------------------------------
 * This function attempts to establish a connection with the MySQL database using
 * the connection pool. It then pings the database to ensure the connection is active.
 * If successful, it releases the connection back to the pool and returns a success message.
 * If the connection fails, it throws an error so startup can fail fast.
 *
 * @async
 * @function
 * @returns {Promise<string>} A message indicating whether the database connection is ready.
 */

const checkSQLConnection = async () => {
  const conn = await connection.getConnection();
  try {
    await conn.ping();
    return `Database connection successful (${process.env.DB_HOST_NAME || "127.0.0.1"}:${dbPort})`;
  } catch (error) {
    throw new Error(
      `Database connection failed at ${process.env.DB_HOST_NAME || "127.0.0.1"}:${dbPort} - ${
        error.message || error
      }`
    );
  } finally {
    conn.release();
  }
};
module.exports = {
  connection,
  checkSQLConnection,
};