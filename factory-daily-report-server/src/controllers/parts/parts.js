const { getDB } = require("../../utils/database");
const ObjectID = require("mongodb").ObjectID;
const { urlPort } = require("../../utils/variables");
const axios = require("axios");
const Intl = require("intl");

exports.getAllSpareParts = async (req, res) => {
  return res.send(
    await getDB()
      .collection("spareParts")
      .find({ isDeleted: false })
      .sort({ $natural: 1 })
      .toArray()
  );
};
exports.getSparePartById = async (req, res) => {
  res.send(
    await getDB().collection("spareParts").findOne(ObjectID(req.query.id))
  );
};
exports.getSparePartByName = async (req, res) => {
  return res.send(
    await getDB()
      .collection("spareParts")
      .find({ name: { $regex: req.query.name, $options: "i" } })
      .toArray()
  );
};
exports.getSparePartsLikeName = async (req, res) => {
  let query = {
    name: { $regex: `.*${req.query.value}.*`, $options: "i" },
    isDeleted: false,
  };
  return res.send(
    await getDB().collection("spareParts").find(query).limit(5).toArray()
  );
};
exports.getSparePartByExactName = async (req, res) => {
  return res.send(
    await getDB()
      .collection("spareParts")
      .findOne({
        name: { $regex: `^${req.query.name}$`, $options: "i" },
        isDeleted: false,
      })
  );
};
exports.getFilteredSpareParts = async (req, res) => {
  let query = {};
  for (let o in req.query) {
    query[o] = { $in: req.query[o] };
  }
  query.isDeleted = false;
  return res.send(await getDB().collection("spareParts").find(query).toArray());
};
exports.getSparePartsByEquipmentId = async (req, res) => {
  return res.send(
    await getDB()
      .collection("spareParts")
      .find({ machineId: { $regex: req.query.machineId, $options: "i" } })
      .toArray()
  );
};
exports.createSparePart = async (req, res) => {
  if (req.cookies["SYS_SEC_1D"]) {
    let user = (
      await axios.get(`${urlPort}/user/id`, {
        params: { _id: req.cookies["SYS_SEC_1D"] },
      })
    ).data;
    if (typeof user == "string") return res.status(404);
    req.body.isDeleted = false;
    let request = await getDB().collection("spareParts").insertOne(req.body);
    let o = {
      userId: user._id,
      actionTaken: "1",
      table: "Spare Parts",
      link: { name: "PartsId", params: { id: request.insertedId } },
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
    return res.send();
  } else return res.status(404);
};
exports.updateSparePart = async (req, res) => {
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
      table: "Spare Parts",
      link: { name: "PartsId", params: { id: req.body.id } },
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
        .collection("spareParts")
        .replaceOne({ _id: ObjectID(req.body.id) }, req.body)
    );
  } else return res.status(404);
};
exports.deleteSparePart = async (req, res) => {
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
      table: "Spare Parts",
      link: { name: "PartsId", params: { id: req.body.id } },
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
        .collection("spareParts")
        .updateOne(
          { _id: ObjectID(req.body.id) },
          { $set: { isDeleted: true } }
        )
    );
  } else return res.status(404);
};
