const { buildSuccess } = require("../composer/success-response");

function sendSuccess(res, statusCode, data) {
  return res.status(statusCode).json(buildSuccess(data));
}

function sendNoContent(res) {
  return res.status(204).send();
}

module.exports = {
  sendSuccess,
  sendNoContent,
};
