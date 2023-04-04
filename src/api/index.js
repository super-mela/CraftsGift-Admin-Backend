const express = require("express");

const { authRouter } = require("./resources/auth");
const { productRouter } = require("./resources/product");
const { offerRouter } = require("./resources/offer");
const { categoryRouter } = require("./resources/category");
const { locationRouter } = require("./resources/location");
const { customerRouter } = require("./resources/customer");
const { orderRouter } = require("./resources/order");
const { paymentRouter } = require("./resources/payment");
const { feedbackRouter } = require("./resources/feedback");
const { addressRouter } = require("./resources/address");
const { web } = require('./resources/web');
const { settingRouter } = require("./resources/setting")

const restRouter = express.Router();


restRouter.use('/', authRouter)
restRouter.use('/auth', authRouter);
restRouter.use('/address', addressRouter);
restRouter.use('/customer', customerRouter);
restRouter.use('/location', locationRouter);
restRouter.use('/product', productRouter);
restRouter.use('/offer', offerRouter);
restRouter.use('/category', categoryRouter);
restRouter.use('/order', orderRouter);
restRouter.use('/payment', paymentRouter);
restRouter.use('/feedback', feedbackRouter);
restRouter.use('/web', web);
restRouter.use('/setting', settingRouter);

module.exports = {
    restRouter
}




