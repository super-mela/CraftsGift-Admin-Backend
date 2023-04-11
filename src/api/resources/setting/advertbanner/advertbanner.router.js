const express = require("express");
const advertbannerController = require("./advertbanner.controller")

const { sanitize } = require("../../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../../middleware/strategy");


const advertbannerRouter = express.Router();
advertbannerRouter.route("/create").post(sanitize(), jwtStrategy, advertbannerController.addBanner);
advertbannerRouter.route("/list").get(sanitize(), advertbannerController.getAllBanner);


module.exports = { advertbannerRouter }