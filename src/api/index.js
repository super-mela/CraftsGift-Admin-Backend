const express = require("express");

const { authRouter } = require("./resources/auth");
const { productRouter } = require("./resources/product");
const { vendorRouter } = require("./resources/vendor");
const { categoryRouter } = require("./resources/category");
const { locationRouter } = require("./resources/location");
const { customerRouter } = require("./resources/customer");
const { orderRouter } = require("./resources/order");
const { paymentRouter } = require("./resources/payment");
const { feedbackRouter } = require("./resources/feedback");
const { addressRouter } = require("./resources/address");

const restRouter = express.Router();


restRouter.use('/', authRouter)
restRouter.use('/auth', authRouter);
restRouter.use('/address', addressRouter);
restRouter.use('/customer', customerRouter);
restRouter.use('/location', locationRouter);
restRouter.use('/product', productRouter);
restRouter.use('/vendor', vendorRouter);
restRouter.use('/category', categoryRouter);
restRouter.use('/order', orderRouter);
restRouter.use('/payment', paymentRouter);
restRouter.use('/feedback', feedbackRouter);

module.exports = {
    restRouter
}




