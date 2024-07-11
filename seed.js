const mongoose = require('mongoose');
const Product = require('./models/Product');

async function fetchData() {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    return products;
}

async function seedDB(){
    let arr = await fetchData();
    await Product.insertMany(arr);
    console.log('DB seeded');
}
module.exports = seedDB;
