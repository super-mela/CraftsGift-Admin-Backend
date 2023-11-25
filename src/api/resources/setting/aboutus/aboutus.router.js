const express = require("express");
const aboutusController = require("./aboutus.controller")

const { sanitize } = require("../../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../../middleware/strategy");


const aboutusRoute = express.Router();
aboutusRoute.route("/create").post(sanitize(), jwtStrategy, aboutusController.addAboutUs);
aboutusRoute.route("/list").get(sanitize(), aboutusController.getAllAboutUs);
aboutusRoute.route("/update").post(sanitize(), jwtStrategy, aboutusController.updateAboutUs);



module.exports = { aboutusRoute }