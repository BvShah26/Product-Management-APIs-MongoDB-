const express = require('express')
const router = express.Router();
router.use(express.json());

const sellerModel = require('../models/sellerModel');

router.get('/', (req, res) => res.send('Seller Home Page'))

router.get('/list', async (req, res) => {
    const sellerList = await sellerModel.find();
    if (sellerList.length === 0) {
        return res.json({ data: "No Data Found in Collection - Seller" });
    }
    return res.json({ data: sellerList });
});

// fetch seller details based on product name
// http://localhost:5000/seller/list/product/Gold Ring
router.get("/list/product/:pname", async (req, res) => {
    const pname = req.params.pname;
    const productModel = require('../models/productModel');
    const productList = await productModel.find({ title: pname });

    if (productList.length != 0) {
        const sellerList = await sellerModel.find({ productId: { $in: [productList[0].productId] } });
        if (sellerList.length === 0) {
            return res.json({ data: "No Seller Data Found With this Product Name" });
        }
        return res.json({ data: sellerList });
    }
    return res.json({ data: "No Product Found With this Name..." });
});


router.post('/new', async (req, res) => {
    const { newSeller } = req.body;
    const oldSellerList = sellerModel.find();
    const filteredSellerList = (await oldSellerList).filter((s) => s.sellerId === newSeller.sellerId);

    if (filteredSellerList.length === 0) {
        sellerModel.create(newSeller);
        return res.json({ data: "New Seller Added" });
    }
    return res.json({ data: "Seller Already Exists" });
});

// update seller (add/remove products)
router.put('/update/:sname', async (req, res) => {
    const sname = req.params.sname;
    const sid = req.body.productId;
    const sellerList = await sellerModel.find({ name: sname });
    if (sellerList.length > 0) {
        const updatedSeller = await sellerModel.findOneAndUpdate({ name: sname }, { productId: sid }, { new: true });
        return res.json({data:updatedSeller});
    }
    return res.json({ data: "Seller Not Exists" });
});

// delete seller
router.delete("/delete/:sname", async (req, res) => {
    const sname = req.params.sname;
    const sellerList = await sellerModel.find({ name: sname });
    if (sellerList.length === 0) {
        return res.json({ data: "Seller Not Found" });
    }
    const deletedCompany = await sellerModel.findOneAndDelete({name:sname});
    return res.json({data:"Seller Deleted"});
});


module.exports = router;