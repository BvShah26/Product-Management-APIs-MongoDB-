const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    companyId: String,
    name: String,
    productId: Array
});

const companyModel = mongoose.model("company", companySchema, "company");

module.exports = companyModel;