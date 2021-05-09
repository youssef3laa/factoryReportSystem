const express = require("express");

const spareParts = require("../../controllers/parts/parts");

const router = express.Router();

router.get("/name", spareParts.getSparePartByName);

router.get("/exactName", spareParts.getSparePartByExactName);

router.get("/id", spareParts.getSparePartById);

router.get("/", spareParts.getAllSpareParts);

router.post("/create", spareParts.createSparePart);

router.post("/update", spareParts.updateSparePart);

router.post("/delete", spareParts.deleteSparePart);

router.get("/equipmentId", spareParts.getSparePartsByEquipmentId);

module.exports = router;
