const express = require("express");

const equipments = require("../../controllers/equipments/equipments");

const router = express.Router();

router.get("/name", equipments.getEquipmentByName);

router.get("/id", equipments.getEquipmentById);

router.get("/", equipments.getAllEquipments);

router.post("/create", equipments.createEquipment);

router.post("/update", equipments.updateEquipment);

router.post("/delete", equipments.deleteEquipment);

router.get("/filter", equipments.getFilteredEquipments);

router.get("/fieldId", equipments.getEquipmentByFieldId);

module.exports = router;
