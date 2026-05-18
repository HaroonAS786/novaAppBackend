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
    // Initialize DB (can be skipped in environments where migrations are handled separately)
    if (process.env.SKIP_MIGRATIONS !== "true") {
      await initializeDatabase();

      // seed demo data after migrations
      await userModel.seedDemoUser();
      await productModel.seedProducts();
    } else {
      console.log("Skipping migrations and seeding (SKIP_MIGRATIONS=true)");
    }
  } catch (error) {
    console.error("Failed to initialize database:", error.message || error);
    process.exit(1);
  }

  const PORT = config.port || Number(process.env.PORT) || 3000;
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`NOVA Market API listening on port ${PORT}`);
  });

  return server;
}

module.exports = { startServer };
