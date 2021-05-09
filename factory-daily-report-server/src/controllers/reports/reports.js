const { getDB } = require("../../utils/database");
const ObjectID = require("mongodb").ObjectID;
const { urlPort } = require("../../utils/variables");
const axios = require("axios");
const Intl = require("intl");

exports.getAllReports = async (req, res) => {
  return res.send(
    await getDB()
      .collection("reports")
      .find({ isDeleted: false })
      .sort({ date: -1 })
      .toArray()
  );
};
exports.getReportById = async (req, res) => {
  res.send(await getDB().collection("reports").findOne(ObjectID(req.query.id)));
};
const getReportNumber = async (results) => {
  if (results.data.length == 0) return "1";
  else
    return (parseInt(results.data[0].reportCode.split("-")[2]) + 1).toString();
};
const getReportContainReportCodeDesc = async (reportCode) => {
  return {
    data: await getDB()
      .collection("reports")
      .find({ reportCode: { $regex: `.*${reportCode}.*` }, isDeleted: false })
      .sort({ $natural: -1 })
      .limit(1)
      .toArray(),
  };
};
exports.getReportContainReportCodeDesc = getReportContainReportCodeDesc;
exports.getFilteredReports = async (req, res) => {
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
  query["isDeleted"] = false;
  return res.send(await getDB().collection("reports").find(query).toArray());
};
exports.getReportsMoreThanOrEqualDate = async (req, res) => {
  let query = [
    { $match: { date: { $gte: req.query.date } } },
    {
      $unwind: "$partsDetails",
    },
    {
      $group: {
        _id: "$partsDetails.partCode",
        totalQuantity: {
          $sum: "$partsDetails.quantity",
        },
      },
    },
  ];
  return res.send(
    await getDB().collection("reports").aggregate(query).toArray()
  );
};
exports.getReportsLikeReportCode = async (req, res) => {
  let query = {
    reportCodeValue: { $regex: `.*${req.query.value}.*`, $options: "i" },
  };
  return res.send(
    await getDB().collection("reports").find(query).limit(5).toArray()
  );
};
exports.createReport = async (req, res) => {
  if (req.cookies["SYS_SEC_1D"]) {
    let user = (
      await axios.get(`${urlPort}/user/id`, {
        params: { _id: req.cookies["SYS_SEC_1D"] },
      })
    ).data;
    if (typeof user == "string") return res.status(404);
    let reportNumber = await getReportNumber(
      await getReportContainReportCodeDesc(req.body.reportCode)
    );
    req.body.reportCode += reportNumber;
    req.body.reportCodeValue += reportNumber;
    req.body.reportedBy = user._id;
    let request = await getDB().collection("reports").insertOne(req.body);
    let o = {
      userId: user._id,
      actionTaken: "1",
      table: "Reports",
      link: { name: "ReportId", params: { id: request.insertedId } },
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
exports.updateReport = async (req, res) => {
  if (req.cookies["SYS_SEC_1D"]) {
    let user = (
      await axios.get(`${urlPort}/user/id`, {
        params: { _id: req.cookies["SYS_SEC_1D"] },
      })
    ).data;
    if (typeof user == "string") return res.status(404);
    let r = (
      await axios.get(`${urlPort}/reports/id`, {
        params: { id: req.body.id },
      })
    ).data;
    if (req.body.fieldId != r.fieldId || req.body.machineId != r.machineId) {
      let reportNumber = await getReportNumber(
        await getReportContainReportCodeDesc(req.body.reportCode)
      );
      req.body.reportCode =
        req.body.reportCode.split("-", 2).join("-") + "-" + reportNumber;
    }
    let o = {
      userId: user._id,
      actionTaken: "2",
      table: "Reports",
      link: { name: "ReportId", params: { id: req.body.id } },
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
        .collection("reports")
        .replaceOne({ _id: ObjectID(req.body.id) }, req.body)
    );
  } else return res.status(404);
};
exports.deleteReport = async (req, res) => {
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
      table: "Reports",
      link: { name: "ReportId", params: { id: req.body.id } },
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
        .collection("reports")
        .updateOne(
          { _id: ObjectID(req.body.id) },
          { $set: { isDeleted: true } }
        )
    );
  } else return res.status(404);
};
