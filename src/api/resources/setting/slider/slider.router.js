const express = require("express");
const sliderController = require("./slider.controller")

const { sanitize } = require("../../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../../middleware/strategy");


const sliderRouter = express.Router();
sliderRouter.route("/create").post(sanitize(), jwtStrategy, sliderController.addSlider);
sliderRouter.route("/list").get(sanitize(), sliderController.getAllSliders);
sliderRouter.route("/update").post(sanitize(), jwtStrategy, sliderController.updateSliders);



module.exports = { sliderRouter }