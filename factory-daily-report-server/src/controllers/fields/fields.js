const { getDB } = require("../../utils/database");
const ObjectID = require("mongodb").ObjectID;
const { urlPort } = require("../../utils/variables");
const axios = require("axios");
const Intl = require("intl");

exports.getAllFields = async (req, res) => {
  return res.send(
    await getDB().collection("fields").find().sort({ $natural: 1 }).toArray()
  );
};
exports.getFieldById = async (req, res) => {
  res.send(await getDB().collection("fields").findOne(ObjectID(req.query.id)));
};
exports.getFieldByName = async (req, res) => {
  return res.send(
    await getDB()
      .collection("fields")
      .find({ name: { $regex: req.query.name, $options: "i" } })
      .toArray()
  );
};
exports.getFilteredFields = async (req, res) => {
  let query = {};
  for (let o in req.query) {
    if (o == "_id") req.query[o] = req.query[o].map((id) => ObjectID(id));
    query[o] = { $in: req.query[o] };
  }
  return res.send(await getDB().collection("fields").find(query).toArray());
};
exports.createField = async (req, res) => {
  if (req.cookies["SYS_SEC_1D"]) {
    let user = (
      await axios.get(`${urlPort}/user/id`, {
        params: { _id: req.cookies["SYS_SEC_1D"] },
      })
    ).data;
    if (typeof user == "string") return res.status(404);
    let request = await getDB().collection("fields").insertOne(req.body);
    let o = {
      userId: user._id,
      actionTaken: "1",
      table: "Fields",
      link: { name: "FieldsId", params: { id: request.insertedId } },
      timestamp: new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }).format(new Date()),
    };
    axios.post(`${urlPort}/logs/create`, o);
    return res.send(request);
  } else return res.status(404);
};
exports.updateField = async (req, res) => {
  if (req.cookies["SYS_SEC_1D"]) {
    let user = (
      await axios.get(`${urlPort}/user/id`, {
        params: { _id: req.cookies["SYS_SEC_1D"] },
      })
    ).data;
    if (typeof user == "string") return res.status(404);
    let o = {
      userId: user._id,
      actionTaken: "2",
      table: "Fields",
      link: { name: "FieldsId", params: { id: req.body.id } },
      timestamp: new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }).format(new Date()),
    };
    axios.post(`${urlPort}/logs/create`, o);
    return res.send(
      getDB()
        .collection("fields")
        .replaceOne({ _id: ObjectID(req.body.id) }, req.body)
    );
  } else return res.status(404);
};
exports.deleteField = async (req, res) => {};
