const express = require("express");

const teamSections = require("../../controllers/teams/teamSections");

const router = express.Router();

router.get("/name", teamSections.getSectionByName);

router.get("/id", teamSections.getSectionById);

router.get("/", teamSections.getAllSections);

router.post("/create", teamSections.createSection);

router.post("/update", teamSections.updateSection);

router.post("/delete/:SectionId", teamSections.deleteSection);

module.exports = router;
