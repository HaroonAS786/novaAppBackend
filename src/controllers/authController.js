const authService = require("../services/authService");
const { sendNoContent, sendSuccess } = require("../helpers/responseHelper");

async function signup(req, res) {
  const data = await authService.signup(req.body);
  return sendSuccess(res, 201, data);
}

async function login(req, res) {
  const data = await authService.login(req.body);
  return sendSuccess(res, 200, data);
}

function me(req, res) {
  return sendSuccess(res, 200, authService.me(req.user));
}

function logout(req, res) {
  return sendNoContent(res);
}

module.exports = {
  signup,
  login,
  me,
  logout,
};
