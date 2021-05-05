const { getDB } = require("../../utils/database");
const ObjectID = require("mongodb").ObjectID;
const { urlPort } = require("../../utils/variables");
const axios = require("axios");
const Intl = require("intl");

exports.getAllSections = async (req, res) => {
  return res.send(
    await getDB()
      .collection("teamSections")
      .find()
      .sort({ $natural: 1 })
      .toArray()
  );
};
exports.getSectionById = async (req, res) => {
  res.send(
    await getDB().collection("teamSections").findOne(ObjectID(req.query.id))
  );
};
exports.getSectionByName = async (req, res) => {
  return res.send(
    await getDB()
      .collection("teamSections")
      .find({
        $or: [
          { name_eng: { $regex: req.query.name, $options: "i" } },
          { name_ar: { $regex: req.query.name, $options: "i" } },
        ],
      })
      .toArray()
  );
};
exports.createSection = async (req, res) => {
  if (req.cookies["SYS_SEC_1D"]) {
    let user = (
      await axios.get(`${urlPort}/user/id`, {
        params: { _id: req.cookies["SYS_SEC_1D"] },
      })
    ).data;
    if (typeof user == "string") return res.status(404);
    let request = await getDB().collection("teamSections").insertOne(req.body);
    let o = {
      userId: user._id,
      actionTaken: "1",
      table: "Team Sections",
      link: { name: "TeamSectionsId", params: { id: request.insertedId } },
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
exports.updateSection = async (req, res) => {
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
      table: "Team Sections",
      link: { name: "TeamSectionsId", params: { id: req.body.id } },
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
        .collection("teamSections")
        .replaceOne({ _id: ObjectID(req.body.id) }, req.body)
    );
  } else return res.status(404);
};
exports.deleteSection = async (req, res) => {};
