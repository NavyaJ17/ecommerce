const express = require('express');
const Product = require('../models/Product');
const Review = require('../models/Review');
const {validateProduct, isLoggedIn, isSeller, isProductAuthor} = require('../middleware');
const router = express.Router();

router.get('/products', async (req, res) => {
    try{
        let products = await Product.find({});
        res.render('products/index', {products});
    }
    catch (error){
        res.render('error', {msg: error.message});
    }
})

router.get('/products/new', isLoggedIn, isSeller, (req, res) => {
    try{
        res.render('products/new');
    }
    catch (error){
        res.render('error', {msg: error.message});
    }
})

router.post('/products', isLoggedIn, isSeller, validateProduct, async (req, res) => {
    try{
        let {title, price, description, category, image} = req.body;
        await Product.create({title, price, description, category, image, author:req.user._id});
        res.redirect('/products')
    }
    catch (error){
        res.render('error', {msg: error.message});
    }
})

router.get('/products/:id', async (req, res) => {
    try{
        let {id} = req.params;
        let product = await Product.findById(id).populate('reviews');
        res.render('products/show', {product})
    }
    catch (error){
        res.render('error', {msg: error.message});
    }
})

router.get('/products/:id/edit', isLoggedIn, isSeller, isProductAuthor, async (req, res) => {
    try{
        let {id} = req.params;
        let product = await Product.findById(id);
        res.render('products/edit', {product});
    }
    catch (error){
        res.render('error', {msg: error.message});
    }
})

router.patch('/products/:id', isLoggedIn, isSeller, isProductAuthor, async (req, res) => {
    try{
        let {title, price, description, category, image} = req.body;
        let {id} = req.params;
        await Product.findByIdAndUpdate(id, {title, price, description, category, image});
        res.redirect(`/products/${id}`);
    }
    catch (error){
        res.render('error', {msg: error.message});
    }
})

router.delete('/products/:id', isLoggedIn, isSeller, isProductAuthor, async (req, res) => {
    try{
        let {id} = req.params;
        let product = await Product.findById(id);
        for(let item of product.reviews){
            await Review.findByIdAndDelete(item);
        }
        await Product.findByIdAndDelete(id);
        res.redirect('/products');
    }
    catch (error){
        res.render('error', {msg: error.message});
    }
})

module.exports = router;