const express = require("express");

const { authRouter } = require("./resources/auth");
const { productRouter } = require("./resources/product");
const { offerRouter } = require("./resources/offer");
const { categoryRouter } = require("./resources/category");
const { customerRouter } = require("./resources/customer");
const { orderRouter } = require("./resources/order");
const { paymentRouter } = require("./resources/payment");
const { feedbackRouter } = require("./resources/feedback");
const { web } = require('./resources/web');
const { settingRouter } = require("./resources/setting")
const { crystalRouter } = require("./resources/crystal")

const restRouter = express.Router();


restRouter.use('/', authRouter)
restRouter.use('/auth', authRouter);
restRouter.use('/customer', customerRouter);
restRouter.use('/product', productRouter);
restRouter.use('/offer', offerRouter);
restRouter.use('/category', categoryRouter);
restRouter.use('/order', orderRouter);
restRouter.use('/payment', paymentRouter);
restRouter.use('/feedback', feedbackRouter);
restRouter.use('/web', web);
restRouter.use('/setting', settingRouter);
restRouter.use('/crystal', crystalRouter);

module.exports = {
    restRouter
}




