const express = require("express");
const catAdvertController = require("./category.controller")

const { sanitize } = require("../../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../../middleware/strategy");


const catAdvertRouter = express.Router();
catAdvertRouter.route("/create").post(sanitize(), jwtStrategy, catAdvertController.addcatAdvert);
catAdvertRouter.route("/list").get(sanitize(), catAdvertController.getAllCatAdvert);
catAdvertRouter.route("/update").post(sanitize(), jwtStrategy, catAdvertController.updateCatAdvert);



module.exports = { catAdvertRouter }