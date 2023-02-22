// import express from "express";
// import feedbackController from "./feedback.controller";
// import { sanitize } from "../../../middleware/sanitizer";

const express = require("express");
const feedbackController = require("./feedback.controller");
const { sanitize } = require("../../../middleware/sanitizer");

const feedbackRouter = express.Router();

feedbackRouter.route("/sendfeedback").post(sanitize(), feedbackController.sendfeedback);

module.exports = { feedbackRouter }