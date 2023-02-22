// import express from 'express';
// import locationController from './location.controller';
// import { sanitize } from '../../../middleware/sanitizer';
// import { jwtStrategy } from '../../../middleware/strategy';
// import { validateBody, schemas } from '../../../middleware/validator';

const express = require("express");
const locationController = require("./location.controller");
const { sanitize } = require("../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../middleware/strategy")
const { validateBody, schemas } = require("../../../middleware/validator")

const locationRouter = express.Router();
locationRouter.route('/create').post(sanitize(), jwtStrategy, locationController.index);
locationRouter.route('/list').get(sanitize(), locationController.List);
locationRouter.route('/delete').delete(sanitize(), jwtStrategy, locationController.getLocationDelete);
locationRouter.route('/update').post(sanitize(), jwtStrategy, locationController.getLocationUpdate);

//area create
locationRouter.route('/area/create').post(sanitize(), jwtStrategy, locationController.areaCreate);
locationRouter.route('/area/list').get(sanitize(), locationController.areaList);
locationRouter.route('/area/delete').delete(sanitize(), jwtStrategy, locationController.getAreaDeleteById);
locationRouter.route('/area/update').post(sanitize(), jwtStrategy, locationController.getAreaUpdate);
locationRouter.route('/area/getAllAreaList').get(sanitize(), locationController.getAreaList);

// get location 
locationRouter.route('/area/list/getbyid').get(sanitize(), locationController.getAreaListById);

module.exports = { locationRouter }








