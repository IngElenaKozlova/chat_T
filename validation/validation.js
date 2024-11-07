const Joi = require('joi');

const productSchema = Joi.object({
    article_id: Joi.string().alphanum().min(1).max(30).required().messages({
        'string.alphanum' : "Error has no letter",
        'string.min' : "min 1 num",
        'string.max' : "min 30 num"
    }),
    name: Joi.string().alphanum().min(2).max(45).required().messages({
        'string.alphanum' : "Error has no letter",
        'string.min' : "min 2 num",
        'string.max' : "min 45 num"
    }),
    variant: Joi.string().alphanum().min(1).max(30).required().messages({
        'string.alphanum' : "Error has no letter",
        'string.min' : "min 1 num",
        'string.max' : "min 30 num"
    }),
    update_date: Joi.number().integer().required().messages({
        "number.integer" : "Error need integer",
        "any.required" : "some"
    }),
    quantity: Joi.number().min(0).required().messages({
        "number.min" : "Error min 0 ",
        "any.required" : "some"
    }),
    price: Joi.number().min(0).required().messages({
        "number.min" : "Error min 0 ",
        "any.required" : "some"
    })
  });


module.exports = {
    productSchema
}