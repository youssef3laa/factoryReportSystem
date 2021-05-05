const express = require("express");

const reports = require("../../controllers/reports/reports");

const router = express.Router();

router.get("/id", reports.getReportById);

router.get("/dateMoreThan", reports.getReportsMoreThanOrEqualDate);

router.get("/filter", reports.getFilteredReports);

router.get("/reportsLikeCode", reports.getReportsLikeReportCode);

router.get("/", reports.getAllReports);

router.post("/create", reports.createReport);

router.post("/update", reports.updateReport);

router.post("/delete/:ReportId", reports.deleteReport);

module.exports = router;
