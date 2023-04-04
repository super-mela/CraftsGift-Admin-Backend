const express = require("express");

const { aboutusRoute } = require("./aboutus")

const settingRouter = express.Router();

settingRouter.use('/aboutus', aboutusRoute)


module.exports = {
    settingRouter
}
