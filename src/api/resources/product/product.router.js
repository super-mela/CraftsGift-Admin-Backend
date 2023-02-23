const express = require("express");
const productController = require("./product.controller");
const { sanitize } = require("../../../middleware/sanitizer");
const { customerStrategy, jwtStrategy, jwtCustomerStrategy } = require("../../../middleware/strategy");
const upload = require("../../../awsbucket");
const upload_file = require("../../../photosave");

const productRouter = express.Router();
productRouter.route("/add").post(sanitize(), jwtStrategy, productController.addProduct);
productRouter.route("/customer/add").post(sanitize(), jwtCustomerStrategy, productController.addProduct);
productRouter.route("/customer/addwishlist").post(sanitize(), jwtCustomerStrategy, productController.addWishlist);
productRouter.route("/getAllproduct").get(sanitize(), productController.index);
productRouter.route("/getAllproductList").get(sanitize(), productController.getAllProductList);
productRouter.route("/update").post(sanitize(), productController.update);
productRouter.route("/customer/update").post(sanitize(), jwtCustomerStrategy, productController.update);
productRouter.route("/getProductByCategory").get(sanitize(), productController.getProductListByCategory);
productRouter.route("/getProductById").get(sanitize(), productController.getProductListById);

productRouter.route("/product-offer").post(sanitize(), productController.addProductOffer);
productRouter.route("/getAllProductOffer").get(sanitize(), productController.getProductOffer);
productRouter.route("/delete").delete(sanitize(), productController.productDelete);

productRouter.route("/deleteOfferById/:id").get(sanitize(), productController.productOfferDelete);
productRouter.route("/upload-img").post(sanitize(), productController.multiplePhotoUpload);
productRouter.route("/getAllPhoto").get(sanitize(), productController.getAllPhoto);
productRouter.route("/getAllPhotobyid").get(sanitize(), productController.getAllPhotobyid);
productRouter.route("/slider-photo/delete").delete(sanitize(), productController.deleteSliderPhoto);
productRouter.route("/getSavedProduct").get(sanitize(), jwtCustomerStrategy, productController.getSavedProduct);

//new api
productRouter.route("/search_product").post(productController.searchProductBySubCat);


module.exports = { productRouter }