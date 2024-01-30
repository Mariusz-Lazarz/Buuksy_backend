const express = require("express");
const router = express.Router();
const salonsController = require("../controllers/salonsController");

router.get("/", salonsController.getAllSalons);
router.get("/:id", salonsController.getSalonById);

module.exports = router;
