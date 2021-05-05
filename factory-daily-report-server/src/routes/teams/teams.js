const express = require("express");

const teams = require("../../controllers/teams/teams");

const router = express.Router();

router.get("/filter", teams.getFilteredTeams);

router.get("/name", teams.getTeamByName);

router.get("/id", teams.getTeamById);

router.get("/", teams.getAllTeams);

router.post("/create", teams.createTeam);

router.post("/update", teams.updateTeam);

router.post("/delete/:TeamsId", teams.deleteTeam);

module.exports = router;
