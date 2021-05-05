const express = require("express");

const logs = require("../../controllers/logs/logs");

const router = express.Router();

router.get("/filter", logs.getFilteredLogs);

router.get("/", logs.getAllLogs);

router.post("/create", logs.createLog);

module.exports = router;
