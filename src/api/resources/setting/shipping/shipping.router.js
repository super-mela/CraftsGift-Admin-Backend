const express = require("express");
const shippingController = require("./shipping.controller")

const { sanitize } = require("../../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../../middleware/strategy");


const shippingRouter = express.Router();
shippingRouter.route("/create").post(sanitize(), jwtStrategy, shippingController.addShipping);
shippingRouter.route("/update").post(sanitize(), jwtStrategy, shippingController.updateShipping);
shippingRouter.route("/list").get(sanitize(), shippingController.getAllShippers);


module.exports = { shippingRouter }