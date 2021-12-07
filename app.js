const express = require('express')
const app = express()
app.use(express.json());
const port = 5000;

require("dotenv").config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOURL)
    .then(() => console.log("MongoDB Connected"));


const userRouter = require('./routers/company');
const productRouter = require('./routers/product');
const sellerRouter = require("./routers/seller");

app.get('/', (req, res) => res.send('Product Managment System'))

app.use("/company", userRouter);
app.use("/product", productRouter);
app.use("/seller", sellerRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))