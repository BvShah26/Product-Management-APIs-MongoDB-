const express = require('express');
const router = express.Router(); //R Capital
router.use(express.json());

const productModel = require('../models/productModel');

router.get('/', (req, res) => {
    return res.json({ data: "Product Home Page" });
});

router.get("/list", async (req, res) => {
    const productList = await productModel.find();
    if (productList.length === 0) {
        return res.json({ data: "No Data Found From Collection - Product" });
    }
    return res.json({ data: productList });

});

// fetch all products of a company
// http://localhost:5000/product/list/company/Mantra Ornaments
router.get("/list/company/:cname", async (req, res) => {
    const cname = req.params.cname;
    const companyModel = require('../models/companyModel');
    const companyList = await companyModel.find({ name: cname });

    if (companyList.length != 0) {
        const productList = await productModel.find({ companyId: [companyList[0].companyId] });
        if (productList.length === 0) {
            return res.json({ data: "No Product Data Found With this Seller Name" });
        }
        return res.json({ data: productList });
    }
    return res.json({ data: "No Company Found With this Name..." });
});

// fetch all products of a seller
// http://localhost:5000/product/list/seller/Bhavya
router.get("/list/seller/:sname", async (req, res) => {
    const sname = req.params.sname;
    const sellerModel = require('../models/sellerModel');
    const sellerList = await sellerModel.find({ name: sname });

    if (sellerList.length != 0) {
        const productList = await productModel.find({ sellerId: { $in: [sellerList[0].sellerId] } });
        if (productList.length === 0) {
            return res.json({ data: "No Product Data Found With this Seller Name" });
        }
        return res.json({ data: productList });
    }
    return res.json({ data: "No Seller Found With this Name..." });
});

router.post("/new", async (req, res) => {
    const { newProduct } = req.body;
    const oldProductList = productModel.find();
    const filteredProductList = (await oldProductList).filter((p) => p.productId === newProduct.productId);

    if (filteredProductList.length === 0) {
        productModel.create(newProduct);
        return res.json({ data: "New Product Added" });
    }
    return res.json({ data: "Product Already Exists" });


});

// update product (add/remove category)
router.put('/update/:pname', async (req, res) => {
    const pname = req.params.pname;
    const categories = req.body.category;

    const productList = await productModel.find({ title: pname });
    if (productList.length > 0) {
        const updatedProduct = await productModel.findOneAndUpdate({ title: pname }, { category: categories }, { new: true });
        return res.json({data:updatedProduct});
    }
    return res.json({ data: "Product Not Exists" });
});

// delete Product
router.delete("/delete/:pname", async (req, res) => {
    const pname = req.params.pname;
    const productList = await productModel.find({ title: pname }); // try {name:name}
    if (productList.length === 0) {
        return res.json({ data: "Product Not Found" });
    }
    const deletedCompany = await productModel.findOneAndDelete({ title: pname });
    return res.json({ data: `Product ${pname} Deleted` });
});

module.exports = router;