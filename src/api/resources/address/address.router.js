// import express from "express";
const express = require("express");
// import addressController from "./address.controller";
// import { customerStrategy, jwtStrategy, jwtCustomerStrategy } from "../../../middleware/strategy";
// import { sanitize } from "../../../middleware/sanitizer";
// import { validateBody, schemas } from "../../../middleware/validator";

const addressController = require("./address.controller");
const { jwtCustomerStrategy } = require("../../../middleware/strategy");
const { sanitize } = require("../../../middleware/sanitizer");
const { validateBody, schemas } = require("../../../middleware/validator")

const addressRouter = express.Router();

addressRouter.route("/create").post(sanitize(), validateBody(schemas.address), jwtCustomerStrategy, addressController.addAddress);
addressRouter.route("/update").post(sanitize(), jwtCustomerStrategy, addressController.updateAddress);
addressRouter.route("/deleteById").delete(sanitize(), jwtCustomerStrategy, addressController.deleteAddress);

module.exports = { addressRouter }