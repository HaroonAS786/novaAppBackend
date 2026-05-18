const Joi = require("joi");

const productIdParamSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
});

const addItemSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).default(1),
});

const updateItemSchema = Joi.object({
  quantity: Joi.number().integer().required(),
});

module.exports = {
  addItemSchema,
  productIdParamSchema,
  updateItemSchema,
};
