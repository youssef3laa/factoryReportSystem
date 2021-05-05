const { getDB } = require("../../utils/database");
const ObjectID = require("mongodb").ObjectID;
const { urlPort } = require("../../utils/variables");
const axios = require("axios");
const Intl = require("intl");

exports.getAllTeams = async (req, res) => {
  return res.send(
    await getDB().collection("teams").find().sort({ $natural: 1 }).toArray()
  );
};
exports.getTeamById = async (req, res) => {
  res.send(await getDB().collection("users").findOne(ObjectID(req.query.id)));
};
exports.getTeamByName = async (req, res) => {
  return res.send(
    await getDB()
      .collection("teams")
      .find({ name: { $regex: req.query.name, $options: "i" } })
      .toArray()
  );
};
exports.getFilteredTeams = async (req, res) => {
  let query = {};
  for (let o in req.query) {
    if (o == "name") {
      query[o] = { $regex: `.*${req.query[o]}.*` };
    } else {
      query[o] = { $in: req.query[o] };
    }
  }
  return res.send(await getDB().collection("teams").find(query).toArray());
};
exports.createTeam = async (req, res) => {
  let request = await getDB().collection("teams").insertOne(req.body);
  let o = {
    userId: user._id,
    actionTaken: "1",
    table: "Teams",
    link: { name: "TeamsId", params: { id: request.insertedId } },
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
};
exports.updateTeam = async (req, res) => {
  let o = {
    userId: user._id,
    actionTaken: "2",
    table: "Teams",
    link: { name: "TeamsId", params: { id: req.body.id } },
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
    await getDB()
      .collection("teams")
      .replaceOne({ _id: ObjectID(req.body.id) }, req.body)
  );
};
exports.deleteTeam = async (req, res) => {};
