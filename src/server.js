const app = require("./app");
const config = require("./config/app.config");
const { checkSQLConnection } = require("./config/db.mysql");
const { initializeDatabase } = require("./config/db.init");
const userModel = require("./models/user.model");
const productModel = require("./models/product.model");

async function startServer() {
  try {
    const dbStatus = await checkSQLConnection();
    console.log(dbStatus);

    await initializeDatabase();

    await userModel.seedDemoUser();
    await productModel.seedProducts();
  } catch (error) {
    console.error("Failed to initialize database:", error.message || error);
    process.exit(1);
  }

  const server = app.listen(config.port, () => {
    console.log(`NOVA Market API listening on port ${config.port}`);
  });

  return server;
}

module.exports = { startServer };
