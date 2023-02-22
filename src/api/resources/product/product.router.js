// import express from "express";
// import productController from "./product.controller";
// import { sanitize } from "../../../middleware/sanitizer";
// import { customerStrategy,jwtStrategy, jwtCustomerStrategy,} from "../../../middleware/strategy";
// import upload from "../../../awsbucket";
// import upload_file from "../../../photosave";

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
productRouter.route("/getCustomerProduct").get(sanitize(), jwtCustomerStrategy, productController.getCustomerProduct);
//Category by product
productRouter.route("/getAllGroceryStaple").get(sanitize(), productController.getAllGrocerryStaples);
productRouter.route("/getAllVechicle").get(sanitize(), productController.getAllVechicle);
productRouter.route("/getAllElectronics").get(sanitize(), productController.getAllElectronics);
productRouter.route("/getAllFashion").get(sanitize(), productController.getAllFashion);
productRouter.route("/getAllHealthandbeauty").get(sanitize(), productController.getAllHealthandbeauty);
productRouter.route("/getAllSport").get(sanitize(), productController.getAllSport);
productRouter.route("/getAllHome").get(sanitize(), productController.getAllHome);
productRouter.route("/getAllKids").get(sanitize(), productController.getAllKids);
productRouter.route("/getAllAutoparts").get(sanitize(), productController.getAllAutoparts);
productRouter.route("/getAllVideogames").get(sanitize(), productController.getAllVideogames);
productRouter.route("/list/:slug").get(sanitize(), productController.getAllProductBySlug);
productRouter.route("/getAllByCategory").post(sanitize(), productController.GetAllByCategory);
productRouter.route("/getallProductbySubChildCat").post(sanitize(), productController.getProductSubChildCat);

// Filter product
productRouter.route("/gcatalogsearch/result").get(sanitize(), productController.getFilterbyProduct);
// productRouter.route("/searchfile").post(sanitize(), productController.SearchFile);

//new api
productRouter.route("/search_product").post(productController.searchProductBySubCat);

//aws image delete
productRouter.route("/aws/delete/photo").post(sanitize(), productController.awsProductPhotoDelete);
productRouter.route("/customer/delete/photo").post(sanitize(), productController.customerProductPhotoDelete);

module.exports = { productRouter }