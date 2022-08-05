const Alert = require("../models/Alert");
const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");

// GET ALL ALERTS
async function getAllAlerts(req, res) {
  const alerts = await Alert.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ alerts, count: alerts.length });
}

// GET SINGLE ALERT
async function getSingleAlert(req, res) {
  const {
    user: { userId },
    params: { id: alertId }
  } = req;

  const alert = await Alert.findOne({
    _id: alertId,
    createdBy: userId
  });
  if (!alert) {
    throw new NotFoundError(`No alert with id: ${alertId}`);
  }
  res.status(StatusCodes.OK).json({ alert });
}

// CREATE ALERT
async function createAlert(req, res) {
  req.body.createdBy = req.user.userId;
  if (!req.body.currentValue) {
    throw new BadRequestError("Please provide current value");
  }
  if (!req.body.targetValue && req.body.targetValue !== 0) {
    throw new BadRequestError("Please provide valid target value");
  }
  const alert = await Alert.create(req.body);
  res.status(StatusCodes.CREATED).json({ alert });
}

// UPDATE ALERT
async function updateAlert(req, res) {
  const { id: alertId } = req.params;
  const { status } = req.body;

  if (typeof status !== "boolean") {
    throw new BadRequestError("Invalid status");
  }

  const alert = await Alert.findOne({ _id: alertId });
  if (!alert) {
    throw new NotFoundError(`No alert with id: ${alertId}`);
  }

  alert.status = status;
  await alert.save();
  res.status(StatusCodes.OK).json({ alert });
}

// DELETE ALERT
async function deleteAlert(req, res) {
  const { id: alertId } = req.params;

  const alert = await Alert.findOne({ _id: alertId });
  if (!alert) {
    throw new NotFoundError(`No alert with id: ${alertId}`);
  }
  await alert.remove();
  res.status(StatusCodes.OK).json({ msg: "Successfully deleted alert!" });
}

module.exports = {
  getAllAlerts,
  getSingleAlert,
  createAlert,
  updateAlert,
  deleteAlert
};
