const { getDB } = require("../../utils/database");
const { urlPort } = require("../../utils/variables");
const ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcryptjs");
const axios = require("axios");
const Intl = require("intl");

exports.getAllUsers = async (req, res) => {
  return res.send(
    await getDB().collection("users").find().sort({ $natural: 1 }).toArray()
  );
};
exports.getUserById = async (req, res) => {
  let user = await getDB().collection("users").findOne(ObjectID(req.query._id));
  if (user) {
    let { password, ...data } = user;
    res.send(req.query.returnPassword ? user : data);
  } else {
    res.send({ message: "error" });
  }
};
exports.getUserByName = async (req, res) => {
  return res.send(
    await getDB()
      .collection("users")
      .find({ name: { $regex: req.query.name, $options: "i" } })
      .toArray()
  );
};
exports.getUserByEmail = async (req, res) => {
  return res.send(
    await getDB().collection("users").findOne({ email: req.query.email })
  );
};
exports.registerUser = async (req, res) => {
  const user = await getDB()
    .collection("users")
    .findOne({ email: req.body.email });
  if (!user) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    let request = await getDB().collection("users").insertOne(req.body);
    return res.status(200).send(request);
  } else {
    return res.send({ message: "Email already exists" });
  }
};
exports.loginUser = async (req, res) => {
  const user = await getDB()
    .collection("users")
    .findOne({ email: req.body.email });
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      //   const token = jwt.sign({ _id: user._id }, key);
      res.cookie("SYS_SEC_1D", user._id.toString(), {
        maxAge: 24 * 60 * 60 * 1000,
      });
      let { password, ...data } = user;
      return res.status(200).send(data);
    }
  }
  return res.send({ message: "Email or Password is incorrect" });
};
exports.updateUser = async (req, res) => {
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
    let update = {};
    for (let o in req.body) {
      update[o] = req.body[o];
    }
    return res.send(
      getDB()
        .collection("users")
        .updateOne({ _id: ObjectID(req.body.id) }, { $set: update })
    );
  } else return res.status(404);
};
exports.changePassword = async (req, res) => {
  if (req.cookies["SYS_SEC_1D"]) {
    let user = (
      await axios.get(`${urlPort}/user/id`, {
        params: { _id: req.cookies["SYS_SEC_1D"], returnPassword: true },
      })
    ).data;
    if (typeof user == "string") return res.status(404);
    if (await bcrypt.compare(req.body.oldPassword, user.password)) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      return res.send(
        getDB()
          .collection("users")
          .updateOne(
            { _id: ObjectID(user._id) },
            { $set: { password: req.body.password } }
          )
      );
    } else {
      return res.status(200).send({ message: "error" });
    }
  } else return res.status(404);
};
exports.getFilteredUsers = async (req, res) => {
  let query = {};
  for (let o in req.query) {
    if (o == "name") {
      query[o] = { $regex: `.*${req.query[o]}.*`, $options: "i" };
    } else {
      query[o] = { $in: req.query[o] };
    }
  }
  return res.send(await getDB().collection("users").find(query).toArray());
};
