const mongoose = require("mongoose");

const Owner = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: String,
  whatsapp: String,
  email: String,
  address: String,
  nationalId: String,
  payoutMethod: {
    type: String,
    enum: ["cash", "bank_transfer", "wallet", "other"],
    default: "bank_transfer",
  },
  bankName: String,
  bankAccountName: String,
  bankAccountNumber: String,
  commissionType: {
    type: String,
    enum: ["percentage", "fixed", "none"],
    default: "percentage",
  },
  commissionValue: {
    type: Number,
    default: 0,
  },
  payoutSchedule: String,
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

module.exports = mongoose.model("Owners", Owner, "Owners");
