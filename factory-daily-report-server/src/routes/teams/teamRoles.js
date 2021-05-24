const express = require("express");

const teamRoles = require("../../controllers/teams/teamRoles");

const router = express.Router();

router.get("/name", teamRoles.getRoleByName);

router.get("/id", teamRoles.getRoleById);

router.get("/", teamRoles.getAllRoles);

router.post("/create", teamRoles.createRole);

router.post("/update", teamRoles.updateRole);

router.post("/delete", teamRoles.deleteRole);

module.exports = router;
