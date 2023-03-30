// import express from 'express';
// import orderController from './order.controller';
// import { jwtStrategy } from '../../../middleware/strategy';
// import { sanitize } from '../../../middleware/sanitizer';
// import { validateBody, schemas } from '../../../middleware/validator';

const express = require("express");
const orderController = require("./order.controller");
const { jwtStrategy } = require("../../../middleware/strategy");
const { sanitize } = require("../../../middleware/sanitizer");

const orderRouter = express.Router();
orderRouter.route('/create').post(sanitize(), orderController.index);
orderRouter.route('/list').get(sanitize(), orderController.getAllOrderList);
orderRouter.route('/status/update').post(sanitize(), orderController.statusUpdate);
orderRouter.route('/list').post(sanitize(), orderController.getAllOrderListById);
orderRouter.route('/status').post(sanitize(), orderController.getAllOrderStatus);
orderRouter.route('/count').get(sanitize(), orderController.getAllOrderCount);

//custom orders

orderRouter.route('/custom/create').post(sanitize(), orderController.index);
orderRouter.route('/custom/list').get(sanitize(), orderController.getAllcustomOrderList);
orderRouter.route('/custom/status/update').post(sanitize(), orderController.statusUpdate);
orderRouter.route('/custom/list').post(sanitize(), orderController.getAllOrderListById);
orderRouter.route('/custom/email').post(sanitize(), orderController.sendCustomOrderEmail);
orderRouter.route('/custom/status').post(sanitize(), orderController.getAllOrderStatus);
orderRouter.route('/custom/count').get(sanitize(), orderController.getAllOrderCount);

module.exports = { orderRouter }

















