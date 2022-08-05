const express = require("express");
const router = express.Router();

const {
  getAllAlerts,
  getSingleAlert,
  createAlert,
  updateAlert,
  deleteAlert
} = require("../controllers/alertController");

router.get("/", getAllAlerts);
router.post("/", createAlert);
router.get("/:id", getSingleAlert);
router.patch("/:id", updateAlert);
router.delete("/:id", deleteAlert);

module.exports = router;
