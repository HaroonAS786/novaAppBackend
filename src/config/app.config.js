const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  jwtSecret:
    process.env.JWT_SECRET ||
    process.env.NODE_SECRET_KEY ||
    process.env.SECRET_ACCESS_TOKEN ||
    "nova_market_dev_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "*",
};

module.exports = config;
