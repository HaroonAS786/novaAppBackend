const express = require("express");
const authController = require("../controllers/authController");
const { asyncHandler } = require("../helpers/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { loginSchema, signupSchema } = require("../validators/authValidator");

const router = express.Router();

router.post(
  "/signup",
  validate({ body: signupSchema }),
  asyncHandler(authController.signup)
);
router.post(
  "/login",
  validate({ body: loginSchema }),
  asyncHandler(authController.login)
);
router.get("/me", requireAuth, asyncHandler(authController.me));
router.post("/logout", requireAuth, asyncHandler(authController.logout));

module.exports = router;
