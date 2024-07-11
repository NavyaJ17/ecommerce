const Joi = require('joi');

const productSchema = Joi.object({
    title: Joi.string().trim().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().trim(),
    category: Joi.string().trim(),
    image: Joi.string().trim()
})

const reviewSchema = Joi.object({
    rating: Joi.number().min(0).max(5),
    comment: Joi.string().trim()
})

module.exports = {productSchema, reviewSchema};