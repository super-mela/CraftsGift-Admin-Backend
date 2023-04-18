const express = require("express");
const offerController = require("./offer.controller");
const { sanitize } = require("../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../middleware/strategy")

const offerRouter = express.Router();

offerRouter.route('/create').post(sanitize(), jwtStrategy, offerController.index);
offerRouter.route('/list').get(sanitize(), jwtStrategy, offerController.getAlloffer);
offerRouter.route('/update').post(sanitize(), offerController.offerUpdate);
offerRouter.route('/search').post(sanitize(), offerController.searchOffer);
offerRouter.route('/delete').delete(sanitize(), offerController.offerDelete);


module.exports = { offerRouter }





