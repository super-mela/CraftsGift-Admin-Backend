const express = require("express");

const { aboutusRoute } = require("./aboutus")
const { bannerRouter } = require("./banner")

const settingRouter = express.Router();

settingRouter.use('/aboutus', aboutusRoute)
settingRouter.use('/banner', bannerRouter)


module.exports = {
    settingRouter
}
