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

module.exports = { orderRouter }

















