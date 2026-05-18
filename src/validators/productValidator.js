const Joi = require("joi");

const productQuerySchema = Joi.object({
  search: Joi.string().allow("").optional(),
  category: Joi.string().allow("").optional(),
  inStockOnly: Joi.alternatives()
    .try(Joi.boolean(), Joi.string().valid("true", "false", "1", "0"))
    .optional(),
  sort: Joi.string()
    .valid("featured", "price-low", "price-high", "rating", "newest")
    .default("featured"),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(24),
});

const productIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  productIdParamSchema,
  productQuerySchema,
};
