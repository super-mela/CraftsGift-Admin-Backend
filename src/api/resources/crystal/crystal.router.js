const express = require("express");
const crystalController = require("./crystal.controller");
const { sanitize } = require("../../../middleware/sanitizer");
const { jwtStrategy, jwtCustomerStrategy } = require("../../../middleware/strategy");

const crystalRouter = express.Router();
crystalRouter.route("/add").post(sanitize(), jwtStrategy, crystalController.addcrystal);
crystalRouter.route("/getAllproductList").get(sanitize(), crystalController.getAllcrystalList);
crystalRouter.route("/update").post(sanitize(), crystalController.update);
crystalRouter.route("/getProductById").get(sanitize(), crystalController.getcrystalListById);
crystalRouter.route("/delete").delete(sanitize(), crystalController.crystalDelete);
crystalRouter.route("/upload-img").post(sanitize(), crystalController.multiplePhotoUpload);

module.exports = { crystalRouter }