const { getDB } = require("../../utils/database");

exports.getAllLogs = async (req, res) => {
  return res.send(
    await getDB().collection("logs").find().sort({ $natural: 1 }).toArray()
  );
};
exports.getFilteredLogs = async (req, res) => {
  let query = {};
  for (let o in req.query) {
    query[o] = { $in: req.query[o] };
  }
  return res.send(await getDB().collection("logs").find(query).toArray());
};
exports.createLog = (req, res) => {
  return res.send(getDB().collection("logs").insertOne(req.body));
};
