const Joi = require("joi");

const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().trim().lowercase().email({ tlds: false }).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email({ tlds: false }).required(),
  password: Joi.string().required(),
});

module.exports = {
  loginSchema,
  signupSchema,
};
