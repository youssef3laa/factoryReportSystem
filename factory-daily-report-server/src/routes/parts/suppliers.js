const express = require("express");

const suppliers = require("../../controllers/parts/suppliers");

const router = express.Router();

router.get("/name", suppliers.getSupplierByName);

router.get("/id", suppliers.getSupplierById);

router.get("/", suppliers.getAllSuppliers);

router.post("/create", suppliers.createSupplier);

router.post("/update", suppliers.updateSupplier);

router.post("/delete/:SupplierId", suppliers.deleteSupplier);

router.get("/filter", suppliers.getFilteredSuppliers);

module.exports = router;
