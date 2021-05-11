const { getDB } = require("../../utils/database");
const ObjectID = require("mongodb").ObjectID;
const { urlPort } = require("../../utils/variables");
const axios = require("axios");
const Intl = require("intl");

exports.getAllFields = async (req, res) => {
  return res.send(
    await getDB()
      .collection("fields")
      .find({ isDeleted: false })
      .sort({ $natural: 1 })
      .toArray()
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
  query.isDeleted = false;
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
    req.body.isDeleted = false;
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
    req.body.isDeleted = false;
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
exports.deleteField = async (req, res) => {
  if (req.cookies["SYS_SEC_1D"]) {
    let user = (
      await axios.get(`${urlPort}/user/id`, {
        params: { _id: req.cookies["SYS_SEC_1D"] },
      })
    ).data;
    if (typeof user == "string") return res.status(404);
    let o = {
      userId: user._id,
      actionTaken: "3",
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
        .updateOne(
          { _id: ObjectID(req.body.id) },
          { $set: { isDeleted: true } }
        )
    );
  } else return res.status(404);
};
