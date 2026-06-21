const mongoose = require("mongoose");

const Payment = new mongoose.Schema({
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservations",
    required: true,
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contacts",
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RentalUnits",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owners",
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: "EGP",
  },
  type: {
    type: String,
    enum: ["deposit", "balance", "security_deposit", "refund", "owner_payout", "other"],
    default: "deposit",
  },
  method: {
    type: String,
    enum: ["cash", "bank_transfer", "wallet", "card", "cheque", "other"],
    default: "cash",
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  paymentDate: Date,
  dueDate: Date,
  referenceNumber: String,
  proofImage: String,
  notes: String,
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
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

Payment.index({ reservation: 1, deleted: 1 });
Payment.index({ status: 1, dueDate: 1, deleted: 1 });

module.exports = mongoose.model("RentalPayments", Payment, "RentalPayments");
