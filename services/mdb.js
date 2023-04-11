const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://jordankelloway:puddin1234@cluster0.o6qxc1z.mongodb.net/test"
const pool = new MongoClient(uri);

module.exports = pool;