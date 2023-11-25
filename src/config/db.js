require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@crafts.f8xbxv7.mongodb.net/?retryWrites=true&w=majority`;
// const uri = 'mongodb://localhost:27017/'
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

module.exports = {
    /**
   * Here you may specify which of the database connections below you wish
   * to use as your default connection for all database work. 
   */
    client: new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
    }),

    dbs: client.db("Crafts"),

}