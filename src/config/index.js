// import fs from 'fs';
// import path from 'path';

const fs = require("fs");
const path = require("path");
const app = require("./app");
const db = require("./db");
const redis = require("./redis")
var normalizedPath = __dirname;
var data = { app, db, redis }

// fs.readdirSync(normalizedPath).forEach(function (file) {
//     if (file != 'index.js') {
//         data[file.split('.')[0]] = require(path.join(__dirname, file))['default'];
//     }
// });

module.exports = { data };