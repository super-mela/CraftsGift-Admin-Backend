// import express from 'express';
// import paymentController from './payment.controller';
// import { sanitize } from '../../../middleware/sanitizer';
// import { jwtStrategy } from '../../../middleware/strategy';

const express = require("express");
const paymentController = require("./payment.controller");
const { sanitize } = require("../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../middleware/strategy")

const paymentRouter = express.Router();
paymentRouter.route('/orders').post(sanitize(), paymentController.orderDetails);
paymentRouter.route('/orderlist').post(sanitize(), paymentController.findOrderList);
paymentRouter.route('/getAllPayment').get(sanitize(), jwtStrategy, paymentController.getAllPayment);

// paymentRouter.route('/verification').post(paymentController.paymentVerification);
// paymentRouter.route('/verification').post(sanitize(),paymentController.paymentSuccess);


module.exports = { paymentRouter }








