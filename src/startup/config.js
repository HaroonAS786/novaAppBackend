const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("../config/app.config");

module.exports = function configureApp(app) {
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin === "*" ? true : config.corsOrigin,
      credentials: true,
    })
  );

  if (config.nodeEnv !== "test") {
    app.use(morgan("dev"));
  }
};
