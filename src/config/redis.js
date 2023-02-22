require('dotenv').config();
module.exports = {

    host: process.env.REDIS_HOST || "localhost",

    password: process.env.REDIS_PASSWORD || null,

    port: process.env.REDIS_PORT || 6379,

}