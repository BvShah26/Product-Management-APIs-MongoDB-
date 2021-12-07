const express = require('express');
const router = express.Router();
router.use(express.json());

const companyModel = require('../models/companyModel');

router.get("/", (req, res) => {
    return res.json({ data: "Company Home Page" });
});

router.get("/list", async (req, res) => {
    const companyList = await companyModel.find();
    if (companyList.length === 0) {
        return res.json({ data: "No Data Found in Collection - company" });
    }
    return res.json({ data: companyList });

});

// fetch company details based on product name
// http://localhost:5000/company/list/product/Gold Ring
router.get("/list/product/:pname", async (req, res) => {
    const pname = req.params.pname;
    const productModel = require('../models/productModel');
    const productList = await productModel.find({ title: pname });

    if (productList.length != 0) {
        const companyList = await companyModel.find({ productId: { $in: [productList[0].productId] } });
        if (companyList.length === 0) {
            return res.json({ data: "No Company Data Found With this Product Name" });
        }
        return res.json({ data: companyList });
    }
    return res.json({ data: "No Product Found With this Name..." });


});


router.post('/new', async (req, res) => {

    const { newCompany } = req.body;
    const oldCompanyList = companyModel.find();
    const filteredCompanyList = (await oldCompanyList).filter((c) => c.companyId === newCompany.companyId);

    if (filteredCompanyList.length === 0) {
        companyModel.create(newCompany);
        return res.json({ data: "New Company Added" });
    }

    return res.json({ data: "Company Already Exists" });
});

// update company (add/remove products)
router.put('/update/:cname', async (req, res) => {
    const cname = req.params.cname;
    const pid = req.body.productId;
    const companyList = await companyModel.find({ name: cname });
    if (companyList.length > 0) {
        const updatedCompany = await companyModel.findOneAndUpdate({ name: cname }, { productId: pid }, { new: true });
        return res.json({data:updatedCompany});
    }
    return res.json({ data: "Company Not Exists" });
});

// delete company
router.delete("/delete/:cname", async (req, res) => {
    const cname = req.params.cname;
    const companyList = await companyModel.find({ name: cname });
    if (companyList.length === 0) {
        return res.json({ data: "Company Not Found" });
    }
    const deletedCompany = await companyModel.findOneAndDelete({ name: cname });
    return res.json({ data: "Company Deleted" });
});

module.exports = router;