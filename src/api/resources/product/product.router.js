const express = require("express");
const productController = require("./product.controller");
const { sanitize } = require("../../../middleware/sanitizer");
const { jwtStrategy, jwtCustomerStrategy } = require("../../../middleware/strategy");

const productRouter = express.Router();
productRouter.route("/add").post(sanitize(), jwtStrategy, productController.addProduct);
productRouter.route("/customer/add").post(sanitize(), jwtCustomerStrategy, productController.addProduct);
productRouter.route("/getAllproductList").get(sanitize(), productController.getAllProductList);
productRouter.route("/update").post(sanitize(), productController.update);
productRouter.route("/customer/update").post(sanitize(), jwtCustomerStrategy, productController.update);
productRouter.route("/getProductById").get(sanitize(), productController.getProductListById);
productRouter.route("/delete").delete(sanitize(), productController.productDelete);
productRouter.route("/upload-img").post(sanitize(), productController.multiplePhotoUpload);

module.exports = { productRouter }