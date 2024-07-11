const express = require('express');
const Product = require('../models/Product');
const Review = require('../models/Review');
const {validateReview, isLoggedIn} = require('../middleware');
const router = express.Router();

router.post('/products/:id', isLoggedIn, validateReview, async (req, res) => {
    try{
        let {rating, comment} = req.body;
        let {id} = req.params;
        let product = await Product.findById(id);
        let review = await Review.create({rating, comment});
        product.reviews.push(review);
        await product.save();
        res.redirect(`/products/${id}`);
    }
    catch (error){
        res.render('error', {msg: error.message});
    }
})

module.exports = router;