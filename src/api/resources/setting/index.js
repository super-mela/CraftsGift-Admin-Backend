const express = require("express");

const { aboutusRoute } = require("./aboutus")
const { bannerRouter } = require("./banner")
const { shippingRouter } = require("./shipping")
const { sliderRouter } = require("./slider")
const { catAdvertRouter } = require("./category")
const { advertbannerRouter } = require("./advertbanner")
const { crystalOptionRoute } = require("./crystalOption")

const settingRouter = express.Router();

settingRouter.use('/aboutus', aboutusRoute)
settingRouter.use('/banner', bannerRouter)
settingRouter.use('/shipping', shippingRouter)
settingRouter.use('/slider', sliderRouter)
settingRouter.use('/category', catAdvertRouter)
settingRouter.use('/advertbanner', advertbannerRouter)
settingRouter.use('/crystalOption', crystalOptionRoute)


module.exports = {
    settingRouter
}
