const express = require("express");

const fields = require("../../controllers/fields/fields");

const router = express.Router();

router.get("/name", fields.getFieldByName);

router.get("/id", fields.getFieldById);

router.get("/filter", fields.getFilteredFields);

router.get("/", fields.getAllFields);

router.post("/create", fields.createField);

router.post("/update", fields.updateField);

router.post("/delete/:FieldId", fields.deleteField);

module.exports = router;
