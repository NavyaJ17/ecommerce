const Product = require('./models/Product');
const {productSchema, reviewSchema} = require('./schema');

const validateProduct = (req, res, next) => {
    let {title, price, description, category, image} = req.body;
    let {error} = productSchema.validate({title, price, description, category, image});
    if (error){
        let msg = error.details.map((err) => err.message).join(',');
        return res.render('error', {msg})
    }
    next();
}

const validateReview = (req, res, next) => {
    let {rating, comment} = req.body;
    let {error} = reviewSchema.validate({rating, comment});
    if (error){
        let msg = error.details.map((err) => err.message).join(',');
        return res.render('error', {msg})
    }
    next();
}

const isLoggedIn = (req, res, next) => {
    if(req.xhr && !req.isAuthenticated()){
        req.flash('error', 'Please login first.');
        throw new Error
    }
    if(!req.isAuthenticated()){
        req.flash('error', 'Please login to continue');
        return res.redirect('/login');
    }
    next();
}

const isSeller = (req, res, next) => {
    if(req.user.role != 'seller'){
        req.flash('error', 'You do not have the permissions.')
        return res.redirect('/products');
    }
    next();
}

const isProductAuthor = async (req, res, next) => {
    let {id} = req.params;
    let product = await Product.findById(id);
    if(!product.author.equals(req.user._id)){
        req.flash('error', 'You are not the owner of this product');
        return res.redirect(`/products/${id}`);
    }
    next();
}

module.exports = {validateProduct, validateReview, isLoggedIn, isSeller, isProductAuthor};