const express = require("express");

const user = require("../../controllers/user/user");

const router = express.Router();

router.get("/filter", user.getFilteredUsers);

router.get("/name", user.getUserByName);

router.get("/email", user.getUserByEmail);

router.get("/id", user.getUserById);

router.get("/", user.getAllUsers);

router.post("/register", user.registerUser);

router.post("/login", user.loginUser);

router.post("/update", user.updateUser);

router.post("/change-password", user.changePassword);

module.exports = router;
