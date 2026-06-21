const mongoose = require("mongoose");

const AvailabilityBlock = new mongoose.Schema({
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RentalUnits",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    enum: ["owner_use", "maintenance", "manual_block", "other"],
    default: "manual_block",
  },
  notes: String,
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

AvailabilityBlock.index({ unit: 1, startDate: 1, endDate: 1, deleted: 1 });

module.exports = mongoose.model("AvailabilityBlocks", AvailabilityBlock, "AvailabilityBlocks");
