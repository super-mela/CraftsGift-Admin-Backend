const express = require("express");
const orderController = require("./order.controller");
const { sanitize } = require("../../../middleware/sanitizer");

const orderRouter = express.Router();

//custom orders
// orderRouter.route('/custom/create').post(sanitize(), orderController.index);
orderRouter.route('/custom/list').get(sanitize(), orderController.getAllcustomOrderList);
orderRouter.route('/custom/status/update').post(sanitize(), orderController.statusUpdate);
orderRouter.route('/custom/email').post(sanitize(), orderController.sendCustomOrderEmail);
orderRouter.route('/custom/search').post(sanitize(), orderController.searchCustomOrder);
orderRouter.route('/custom/count').get(sanitize(), orderController.getAllCustomOrderCount);

module.exports = { orderRouter }

















