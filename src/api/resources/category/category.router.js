// import express from "express";
// import categoryController from "./category.controller";
// import { customerStrategy, jwtStrategy } from "../../../middleware/strategy";
// import { sanitize } from "../../../middleware/sanitizer";
// import { validateBody, schemas } from "../../../middleware/validator";

const express = require("express");
const categoryController = require("./category.controller");
const { customerStrategy, jwtStrategy } = require("../../../middleware/strategy");
const { sanitize } = require("../../../middleware/sanitizer");
const { validateBody, schemas } = require("../../../middleware/validator")

const categoryRouter = express.Router();

categoryRouter.route("/getAllSubCategory").get(sanitize(), jwtStrategy, categoryController.getSubCategoryList);
categoryRouter.route("/customer/getAllSubCategory").get(sanitize(), categoryController.getSubCategoryList);

categoryRouter.route("/create").post(sanitize(), validateBody(schemas.category), jwtStrategy, categoryController.addCategory);
categoryRouter.route("/update").post(sanitize(), jwtStrategy, categoryController.updateCategory);
categoryRouter.route("/search").post(sanitize(), categoryController.searchCategory);
//category list
categoryRouter.route("/main-list").get(sanitize(), jwtStrategy, categoryController.getMainList);
categoryRouter.route("/customer/main-list").get(sanitize(), categoryController.getMainList);
categoryRouter.route("/main-list/update").post(sanitize(), jwtStrategy, categoryController.getMainListUpdate);

//child category
categoryRouter.route("/child/deleteById").delete(sanitize(), jwtStrategy, categoryController.deleteCategory);


module.exports = { categoryRouter }