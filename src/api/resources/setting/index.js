const express = require("express");

const { aboutusRoute } = require("./aboutus")
const { bannerRouter } = require("./banner")
const { shippingRouter } = require("./shipping")

const settingRouter = express.Router();

settingRouter.use('/aboutus', aboutusRoute)
settingRouter.use('/banner', bannerRouter)
settingRouter.use('/shipping', shippingRouter)


module.exports = {
    settingRouter
}
