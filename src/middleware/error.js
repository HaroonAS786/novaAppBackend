const { buildError } = require("../composer/error-response");

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;
  const code = error.code || "INTERNAL_SERVER_ERROR";
  const message =
    statusCode === 500 ? "Unexpected server error." : error.message;

  return res.status(statusCode).json(buildError(code, message, error.details || []));
}

module.exports = { errorHandler };
