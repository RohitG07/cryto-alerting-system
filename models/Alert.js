const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema(
  {
    status: {
      type: Boolean,
      default: true
    },
    currentValue: {
      type: Number,
      required: [true, "Please provide a valid current value"]
    },
    targetValue: {
      type: Number,
      required: [true, "Please provide a valid target value"],
      min: 0
    },
    coinId: {
      type: String,
      required: [true, "Please provide coin id"]
    },
    coinName: {
      type: String,
      required: [true, "Please provide coin name"]
    },
    alertType: {
      type: String,
      enum: ["above", "below"],
      required: [true, "Please provide alert type"]
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", AlertSchema);
