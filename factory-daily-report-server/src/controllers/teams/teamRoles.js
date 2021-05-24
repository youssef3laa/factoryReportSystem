const { getDB } = require("../../utils/database");
const ObjectID = require("mongodb").ObjectID;
const { urlPort } = require("../../utils/variables");
const axios = require("axios");
const Intl = require("intl");

exports.getAllRoles = async (req, res) => {
  return res.send(
    await getDB()
      .collection("teamRoles")
      .find({ isDeleted: false })
      .sort({ $natural: 1 })
      .toArray()
  );
};
exports.getRoleById = async (req, res) => {
  res.send(
    await getDB().collection("teamRoles").findOne(ObjectID(req.query.id))
  );
};
exports.getRoleByName = async (req, res) => {
  return res.send(
    await getDB()
      .collection("teamRoles")
      .find({
        $or: [
          { name_eng: { $regex: req.query.name, $options: "i" } },
          { name_ar: { $regex: req.query.name, $options: "i" } },
        ],
      })
      .toArray()
  );
};
exports.createRole = async (req, res) => {
  if (req.cookies["SYS_SEC_1D"]) {
    let user = (
      await axios.get(`${urlPort}/user/id`, {
        params: { _id: req.cookies["SYS_SEC_1D"] },
      })
    ).data;
    if (typeof user == "string") return res.status(404);
    req.body.isDeleted = false;
    let request = await getDB().collection("teamRoles").insertOne(req.body);
    let o = {
      userId: user._id,
      actionTaken: "1",
      table: "Team Roles",
      link: { name: "TeamRolesId", params: { id: request.insertedId } },
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
exports.updateRole = async (req, res) => {
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
      table: "Team Roles",
      link: { name: "TeamRolesId", params: { id: req.body.id } },
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
        .collection("teamRoles")
        .replaceOne({ _id: ObjectID(req.body.id) }, req.body)
    );
  } else return res.status(404);
};
exports.deleteRole = async (req, res) => {
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
      table: "Team Roles",
      link: { name: "TeamRolesId", params: { id: req.body.id } },
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
        .collection("teamRoles")
        .updateOne(
          { _id: ObjectID(req.body.id) },
          { $set: { isDeleted: true } }
        )
    );
  } else return res.status(404);
};
