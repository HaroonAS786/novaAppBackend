const express = require("express");
const configureApp = require("./startup/config");
const registerRoutes = require("./startup/routes");

const app = express();

configureApp(app);
registerRoutes(app);

module.exports = app;
