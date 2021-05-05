const express = require("express");

const technicianReports = require("../../controllers/reports/technicianReports");

const router = express.Router();

router.get("/id", technicianReports.getTechnicianReportById);

router.get("/filter", technicianReports.getFilteredTechnicianReports);

router.get("/", technicianReports.getAllTechnicianReports);

router.post("/create", technicianReports.createTechnicianReport);

router.post("/approve", technicianReports.approveTechnicianReport);

router.post("/reject", technicianReports.rejectTechnicianReport);

router.get("/count", technicianReports.getTechReportsCount);

module.exports = router;
