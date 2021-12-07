const mongoose = require('mongoose');

const sellerSchema = mongoose.Schema({
    sellerId: String,
    name: String,
    productId: Array
});

const sellerModel = mongoose.model("seller", sellerSchema, "seller");
module.exports = sellerModel;