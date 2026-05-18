const fs = require("fs");
const path = require("path");
const { connection } = require("./db.mysql");

async function initializeDatabase() {
  try {
    const migrationsDir = path.join(__dirname, "../..", "migrations");

    if (!fs.existsSync(migrationsDir)) {
      console.log("No migrations directory found, skipping database initialization");
      return;
    }

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    if (migrationFiles.length === 0) {
      console.log("No migration files found");
      return;
    }

    console.log(`Running ${migrationFiles.length} migration(s)...`);

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf8");

      // Split by semicolon to handle multiple statements
      const statements = sql.split(";").filter((stmt) => stmt.trim());

      for (const statement of statements) {
        if (!statement.trim()) continue;

        try {
          await connection.execute(statement);
        } catch (error) {
          const ignoredCodes = [1060, 1091];
          if (ignoredCodes.includes(error.errno)) {
            continue;
          }
          throw error;
        }
      }

      console.log(`✓ ${file}`);
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error.message || error);
    throw error;
  }
}

module.exports = { initializeDatabase };
