const { getDB } = require("../../utils/database");
const ObjectID = require("mongodb").ObjectID;
const { urlPort } = require("../../utils/variables");
const axios = require("axios");
const Intl = require("intl");

exports.getAllSuppliers = async (req, res) => {
  return res.send(
    await getDB()
      .collection("suppliers")
      .find({ isDeleted: false })
      .sort({ $natural: 1 })
      .toArray()
  );
};
exports.getSupplierById = async (req, res) => {
  res.send(
    await getDB().collection("suppliers").findOne(ObjectID(req.query.id))
  );
};
exports.getFilteredSuppliers = async (req, res) => {
  let query = {};
  for (let o in req.query) {
    if (o == "supplyType") {
      req.query[o] = req.query[o].map((x) => parseInt(x));
      query[o] = { $in: req.query[o] };
    } else if (o == "name") {
      query[o] = { $regex: `.*${req.query[o]}.*` };
    }
  }
  query.isDeleted = false;
  return res.send(await getDB().collection("suppliers").find(query).toArray());
};
exports.getSupplierByName = async (req, res) => {
  return res.send(
    await getDB()
      .collection("suppliers")
      .find({ name: { $regex: req.query.name, $options: "i" } })
      .toArray()
  );
};
exports.createSupplier = async (req, res) => {
  if (req.cookies["SYS_SEC_1D"]) {
    let user = (
      await axios.get(`${urlPort}/user/id`, {
        params: { _id: req.cookies["SYS_SEC_1D"] },
      })
    ).data;
    if (typeof user == "string") return res.status(404);
    req.body.isDeleted = false;
    let request = await getDB().collection("suppliers").insertOne(req.body);
    let o = {
      userId: user._id,
      actionTaken: "1",
      table: "Suppliers",
      link: { name: "SuppliersId", params: { id: request.insertedId } },
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
exports.updateSupplier = async (req, res) => {
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
      table: "Suppliers",
      link: { name: "SuppliersId", params: { id: req.body.id } },
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
        .collection("suppliers")
        .replaceOne({ _id: ObjectID(req.body.id) }, req.body)
    );
  } else return res.status(404);
};
exports.deleteSupplier = async (req, res) => {
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
      table: "Suppliers",
      link: { name: "SuppliersId", params: { id: req.body.id } },
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
        .collection("suppliers")
        .updateOne(
          { _id: ObjectID(req.body.id) },
          { $set: { isDeleted: true } }
        )
    );
  } else return res.status(404);
};
