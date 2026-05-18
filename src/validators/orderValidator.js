const Joi = require("joi");
const { ORDER_STATUSES } = require("../constants/orderStatuses");

const checkoutSchema = Joi.object({
  fullName: Joi.string().trim().min(2).required(),
  email: Joi.string().trim().lowercase().email({ tlds: false }).required(),
  phone: Joi.string().trim().min(7).required(),
  address: Joi.string().trim().min(6).required(),
  city: Joi.string().trim().min(2).required(),
  postalCode: Joi.string().trim().min(3).required(),
  deliveryMethod: Joi.string()
    .valid("standard", "express", "scheduled")
    .required(),
  paymentMethod: Joi.string().valid("card", "wallet", "cod").required(),
  cardName: Joi.when("paymentMethod", {
    is: "card",
    then: Joi.string().trim().min(2).required(),
    otherwise: Joi.string().allow("").optional(),
  }),
  cardLast4: Joi.when("paymentMethod", {
    is: "card",
    then: Joi.string().pattern(/^\d{4}$/).required(),
    otherwise: Joi.string().allow("").optional(),
  }),
  notes: Joi.string().allow("").default(""),
});

const orderListQuerySchema = Joi.object({
  status: Joi.string()
    .valid("active", "completed", ...ORDER_STATUSES)
    .optional(),
});

const currentOrderQuerySchema = Joi.object({
  selectedOrderId: Joi.string().trim().optional(),
});

const orderIdParamSchema = Joi.object({
  id: Joi.string().trim().required(),
});

const statusUpdateSchema = Joi.object({
  action: Joi.string().valid("advance").optional(),
  status: Joi.string()
    .valid(...ORDER_STATUSES)
    .optional(),
}).or("action", "status");

module.exports = {
  checkoutSchema,
  currentOrderQuerySchema,
  orderIdParamSchema,
  orderListQuerySchema,
  statusUpdateSchema,
};
