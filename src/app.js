// import express from 'express';
// import logger from 'morgan';
// import path from 'path';
// import passport from 'passport';
// import session from 'express-session';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import expressSanitizer from 'express-sanitizer';
// import helmet from 'helmet';
// import rfs from 'rotating-file-stream';
// import './passport';

const express = require("express");
const logger = require("morgan");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSanitizer = require("express-sanitizer");
const helmet = require("helmet");
const rfs = require("rotating-file-stream");
require("./passport");

module.exports = {
    setup: (config) => {
        const app = express();

        var accessLogStream = rfs('access.log', {
            interval: '1d',
            path: path.join(__dirname, '..', 'log')
        })

        app.use(logger(config.app.log, { stream: accessLogStream }));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({ limit: '50mb' }));
        app.use(cookieParser(config.app.secret));
        app.use(session({ secret: config.app.secret, resave: true, saveUninitialized: true }));
        app.use("/product", express.static(path.join(__dirname, 'photo/product/')));
        app.use("/category", express.static(path.join(__dirname, 'photo/category/')));
        app.use("/multiImages", express.static(path.join(__dirname, 'photo/product/MultiImages')));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(expressSanitizer());
        app.use(helmet());
        app.use(helmet.hsts({
            maxAge: 0
        }))

        Number.prototype.pad = function (size) {
            var s = String(this);
            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
        }

        return app;
    }
}