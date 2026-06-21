const mongoose = require("mongoose");

const reservationStatuses = [
  "inquiry",
  "tentative",
  "confirmed",
  "checked_in",
  "checked_out",
  "cancelled",
  "no_show",
];

const paymentStatuses = ["unpaid", "partial", "paid", "refunded"];

const Reservation = new mongoose.Schema({
  reservationCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RentalUnits",
    required: true,
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contacts",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owners",
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  nights: {
    type: Number,
    min: 1,
  },
  adults: {
    type: Number,
    default: 1,
    min: 0,
  },
  children: {
    type: Number,
    default: 0,
    min: 0,
  },
  source: {
    type: String,
    default: "direct",
  },
  status: {
    type: String,
    enum: reservationStatuses,
    default: "inquiry",
    lowercase: true,
    trim: true,
  },
  subtotal: {
    type: Number,
    default: 0,
  },
  discount: {
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
  totalAmount: {
    type: Number,
    default: 0,
  },
  depositRequired: {
    type: Number,
    default: 0,
  },
  depositPaid: {
    type: Number,
    default: 0,
  },
  balanceDue: {
    type: Number,
    default: 0,
  },
  paymentStatus: {
    type: String,
    enum: paymentStatuses,
    default: "unpaid",
    lowercase: true,
    trim: true,
  },
  depositDueDate: Date,
  cancellationReason: String,
  internalNotes: String,
  guestNotes: String,
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

Reservation.index({ unit: 1, checkInDate: 1, checkOutDate: 1, status: 1, deleted: 1 });
Reservation.index({ guest: 1, deleted: 1 });
Reservation.index({ owner: 1, deleted: 1 });

Reservation.statics.findConfirmedOverlap = function ({
  unit,
  checkInDate,
  checkOutDate,
  excludeReservationId,
}) {
  if (!unit || !checkInDate || !checkOutDate) return null;

  const query = {
    unit,
    deleted: false,
    status: "confirmed",
    checkInDate: { $lt: new Date(checkOutDate) },
    checkOutDate: { $gt: new Date(checkInDate) },
  };

  if (excludeReservationId) {
    query._id = { $ne: excludeReservationId };
  }

  return this.findOne(query);
};

module.exports = mongoose.model("Reservations", Reservation, "Reservations");
