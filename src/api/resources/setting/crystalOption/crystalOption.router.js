const express = require("express");
const crystalOptionController = require("./crystalOption.controller")

const { sanitize } = require("../../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../../middleware/strategy");


const crystalOptionRoute = express.Router();
crystalOptionRoute.route("/create").post(sanitize(), jwtStrategy, crystalOptionController.addCrystalOption);
crystalOptionRoute.route("/list").get(sanitize(), crystalOptionController.getAllCrystalOption);


module.exports = { crystalOptionRoute }