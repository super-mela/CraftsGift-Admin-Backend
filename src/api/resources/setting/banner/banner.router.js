const express = require("express");
const bannerController = require("./banner.controller")

const { sanitize } = require("../../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../../middleware/strategy");


const bannerRouter = express.Router();
bannerRouter.route("/create").post(sanitize(), jwtStrategy, bannerController.addBanner);
bannerRouter.route("/list").get(sanitize(), bannerController.getAllBanner);


module.exports = { bannerRouter }