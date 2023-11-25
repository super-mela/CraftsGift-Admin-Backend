
const express = require("express");
const customerController = require("./customer.controller");
const { sanitize } = require("../../../middleware/sanitizer");

const customerRouter = express.Router();
// get all customer
customerRouter.route('/list').get(sanitize(), customerController.getAllCustomer);
customerRouter.route('/update').post(sanitize(), customerController.getCustomerUpdate);
customerRouter.route('/delete').delete(sanitize(), customerController.deleteCustomer);
customerRouter.route('/search').post(sanitize(), customerController.searchCustomer);
customerRouter.route('/email').post(sanitize(), customerController.sendCustomerEmail);

module.exports = { customerRouter }
