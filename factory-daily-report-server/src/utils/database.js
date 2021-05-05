const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
let _db;
const client = (cb) => {
  mongoClient
    .connect(
      "mongodb+srv://node-test-user:9vNLq3URYNOW5BYN@factory-report-system.qgxk9.mongodb.net/factory-database?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then((resp) => {
      console.log("Connected!");
      _db = resp.db();
      cb();
    })
    .catch((err) => console.error(err));
};

const getDB = () => {
  if (_db) return _db;
  throw "No DB Found";
};
module.exports = {
  getDB: getDB,
  mongoClient: client,
};
