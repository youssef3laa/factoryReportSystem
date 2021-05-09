const { getDB } = require("../../utils/database");
const ObjectID = require("mongodb").ObjectID;
const { urlPort } = require("../../utils/variables");
const axios = require("axios");
const Intl = require("intl");

exports.getAllTechnicianReports = async (req, res) => {
  return res.send(
    await getDB()
      .collection("technicianReports")
      .find({ state: 0 })
      .sort({ date: -1 })
      .toArray()
  );
};
exports.getTechReportsCount = async (req, res) => {
  return res.send(
    (
      await getDB().collection("technicianReports").countDocuments({ state: 0 })
    ).toString()
  );
};
exports.getTechnicianReportById = async (req, res) => {
  return res.send(
    await getDB()
      .collection("technicianReports")
      .findOne(ObjectID(req.query.id))
  );
};
exports.getFilteredTechnicianReports = async (req, res) => {
  let query = {};
  let data = JSON.parse(req.query[0]);
  for (let o in data) {
    if (o == "date") {
      let bd, sd;
      bd = data[o][0] > data[o][1] ? data[o][0] : data[o][1];
      sd = data[o][0] > data[o][1] ? data[o][1] : data[o][0];
      query[o] = {
        $gte: sd,
        $lte: bd,
      };
    } else if (o == "partsDetails") {
      for (let k in data[o][0]) {
        if (k == "quantity") data[o][0][k] = data[o][0][k].map(Number);
        query[`${o}.${k}`] = { $in: data[o][0][k] };
      }
    } else query[o] = { $in: data[o] };
  }
  query["state"] = 0;
  return res.send(
    await getDB().collection("technicianReports").find(query).toArray()
  );
};
exports.createTechnicianReport = async (req, res) => {
  if (req.cookies["SYS_SEC_1D"]) {
    let user = (
      await axios.get(`${urlPort}/user/id`, {
        params: { _id: req.cookies["SYS_SEC_1D"] },
      })
    ).data;
    if (typeof user == "string") return res.status(404);
    req.body.state = 0;
    req.body.reportedBy = user._id;
    let request = await getDB()
      .collection("technicianReports")
      .insertOne(req.body);
    let o = {
      userId: user._id,
      actionTaken: "1",
      table: "Technician Pending Reports",
      link: { name: "TechReportId", params: { id: request.insertedId } },
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
exports.approveTechnicianReport = async (req, res) => {
  if (req.cookies["SYS_SEC_1D"]) {
    let user = (
      await axios.get(`${urlPort}/user/id`, {
        params: { _id: req.cookies["SYS_SEC_1D"] },
      })
    ).data;
    if (typeof user == "string") return res.status(404);
    let r = (
      await axios.get(`${urlPort}/technician-reports/id`, {
        params: { id: req.body.id },
      })
    ).data;
    delete r._id;
    r.state = 1;
    let o = {
      userId: user._id,
      actionTaken: "4",
      table: "Technician Pending Reports",
      link: { name: "TechReportId", params: { id: req.body.id } },
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
        .collection("technicianReports")
        .replaceOne({ _id: ObjectID(req.body.id) }, r)
    );
  } else return res.status(404);
};
exports.rejectTechnicianReport = async (req, res) => {
  if (req.cookies["SYS_SEC_1D"]) {
    let user = (
      await axios.get(`${urlPort}/user/id`, {
        params: { _id: req.cookies["SYS_SEC_1D"] },
      })
    ).data;
    if (typeof user == "string") return res.status(404);
    let r = (
      await axios.get(`${urlPort}/technician-reports/id`, {
        params: { id: req.body.id },
      })
    ).data;
    delete r._id;
    r.state = 2;
    let o = {
      userId: user._id,
      actionTaken: "5",
      table: "Technician Pending Reports",
      link: { name: "TechReportId", params: { id: req.body.id } },
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
        .collection("technicianReports")
        .replaceOne({ _id: ObjectID(req.body.id) }, r)
    );
  } else return res.status(404);
};
exports.deleteTechnicianReport = async (req, res) => {};
