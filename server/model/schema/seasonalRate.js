const mongoose = require("mongoose");

const SeasonalRate = new mongoose.Schema({
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RentalUnits",
    required: true,
  },
  seasonName: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  weekdayRate: {
    type: Number,
    default: 0,
  },
  weekendRate: {
    type: Number,
    default: 0,
  },
  weeklyRate: Number,
  monthlyRate: Number,
  minimumNights: {
    type: Number,
    default: 1,
  },
  currency: {
    type: String,
    default: "EGP",
  },
  priority: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
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

SeasonalRate.index({ unit: 1, startDate: 1, endDate: 1, deleted: 1 });

module.exports = mongoose.model("SeasonalRates", SeasonalRate, "SeasonalRates");
