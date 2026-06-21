const mongoose = require("mongoose");

const RentalUnit = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    trim: true,
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Properties",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owners",
  },
  unitType: {
    type: String,
    enum: ["apartment", "villa", "chalet", "studio", "townhouse", "other"],
    default: "apartment",
  },
  bedrooms: Number,
  bathrooms: Number,
  maxGuests: Number,
  area: String,
  address: String,
  floor: String,
  amenities: [String],
  baseNightlyRate: {
    type: Number,
    default: 0,
  },
  cleaningFee: {
    type: Number,
    default: 0,
  },
  securityDeposit: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: "EGP",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "maintenance"],
    default: "active",
  },
  publicNotes: String,
  internalNotes: String,
  photos: [],
  documents: [],
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

RentalUnit.index({ code: 1 }, { unique: true, sparse: true });
RentalUnit.index({ owner: 1, deleted: 1 });
RentalUnit.index({ status: 1, deleted: 1 });

module.exports = mongoose.model("RentalUnits", RentalUnit, "RentalUnits");
