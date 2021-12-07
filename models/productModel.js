const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    productId: String,
    title: String,
    price: String,
    category: Array,
    companyId: String,
    sellerId: Array
});

const productModel = mongoose.model("product", productSchema, "product");

module.exports = productModel;