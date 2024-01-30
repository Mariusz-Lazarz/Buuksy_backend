const express = require("express");
const router = express.Router();
const visitsController = require("../controllers/visitsController");

// Registration route
router.post("/user", visitsController.saveUserVisit);
router.get("/user", visitsController.getUserVisits);
router.post("/employee", visitsController.saveEmployeeVisit);
router.post("/availability", visitsController.checkEmployeeAvailability);

module.exports = router;
