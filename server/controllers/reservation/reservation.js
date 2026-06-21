const Reservation = require("../../model/schema/reservation");
const AvailabilityBlock = require("../../model/schema/availabilityBlock");

const normalizeEnumValue = (value) => {
  if (typeof value !== "string") return value;
  return value.trim().toLowerCase().replace(/-/g, "_").replace(/\s+/g, "_");
};

const normalizeReservationPayload = (body = {}) => {
  const payload = { ...body };

  if (payload.status) {
    payload.status = normalizeEnumValue(payload.status);
  }

  if (payload.paymentStatus) {
    payload.paymentStatus = normalizeEnumValue(payload.paymentStatus);
  }

  if (payload.unit?._id) {
    payload.unit = payload.unit._id;
  }

  if (payload.guest?._id) {
    payload.guest = payload.guest._id;
  }

  if (payload.owner?._id) {
    payload.owner = payload.owner._id;
  }

  return payload;
};

const calculateNights = (checkInDate, checkOutDate) => {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const day = 1000 * 60 * 60 * 24;
  return Math.ceil((end - start) / day);
};

const validateReservationDates = (body) => {
  const { checkInDate, checkOutDate } = body;
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Invalid reservation dates.";
  }

  if (start >= end) {
    return "checkOutDate must be after checkInDate.";
  }

  return null;
};

const setComputedFields = (body) => {
  if (body.checkInDate && body.checkOutDate) {
    body.nights = calculateNights(body.checkInDate, body.checkOutDate);
  }

  const totalAmount = Number(body.totalAmount || 0);
  const depositPaid = Number(body.depositPaid || 0);

  if (body.balanceDue === undefined) {
    body.balanceDue = Math.max(totalAmount - depositPaid, 0);
  }

  if (!body.paymentStatus) {
    if (totalAmount > 0 && depositPaid >= totalAmount) {
      body.paymentStatus = "paid";
    } else if (depositPaid > 0) {
      body.paymentStatus = "partial";
    }
  }

  return body;
};

const checkConfirmedOverlap = async (body, excludeReservationId) => {
  const status = normalizeEnumValue(body.status);
  if (status !== "confirmed") return null;

  return Reservation.findConfirmedOverlap({
    unit: body.unit,
    checkInDate: body.checkInDate,
    checkOutDate: body.checkOutDate,
    excludeReservationId,
  });
};

const index = async (req, res) => {
  try {
    const query = { ...req.query, deleted: false };
    const result = await Reservation.find(query)
      .populate("unit guest owner createBy")
      .sort({ checkInDate: 1 });
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to get Reservations:", err);
    res.status(400).json({ err, error: "Failed to get Reservations" });
  }
};

const add = async (req, res) => {
  try {
    const normalizedBody = normalizeReservationPayload(req.body);
    const dateError = validateReservationDates(normalizedBody);
    if (dateError) return res.status(400).json({ message: dateError });

    const payload = setComputedFields({ ...normalizedBody, createdDate: new Date() });
    const overlap = await checkConfirmedOverlap(payload);
    if (overlap) {
      return res.status(409).json({
        message: "Rental unit already has a confirmed reservation for this date range.",
        reservation: overlap,
      });
    }

    const result = new Reservation(payload);
    await result.save();
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to create Reservation:", err);
    res.status(400).json({ err, error: "Failed to create Reservation" });
  }
};

const view = async (req, res) => {
  try {
    const result = await Reservation.findOne({ _id: req.params.id, deleted: false })
      .populate("unit guest owner createBy");
    if (!result) return res.status(404).json({ message: "no Data Found." });
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to view Reservation:", err);
    res.status(400).json({ err, error: "Failed to view Reservation" });
  }
};

const edit = async (req, res) => {
  try {
    const existing = await Reservation.findOne({ _id: req.params.id, deleted: false });
    if (!existing) return res.status(404).json({ message: "no Data Found." });
    const normalizedBody = normalizeReservationPayload(req.body);

    const mergedReservation = {
      ...existing.toObject(),
      ...normalizedBody,
      updatedDate: new Date(),
    };

    const dateError = validateReservationDates(mergedReservation);
    if (dateError) return res.status(400).json({ message: dateError });

    setComputedFields(mergedReservation);

    const overlap = await checkConfirmedOverlap(mergedReservation, req.params.id);
    if (overlap) {
      return res.status(409).json({
        message: "Rental unit already has a confirmed reservation for this date range.",
        reservation: overlap,
      });
    }

    const updateData = {
      ...normalizedBody,
      nights: mergedReservation.nights,
      balanceDue: mergedReservation.balanceDue,
      paymentStatus: mergedReservation.paymentStatus,
      updatedDate: new Date(),
    };

    const result = await Reservation.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to update Reservation:", err);
    res.status(400).json({ err, error: "Failed to update Reservation" });
  }
};

const availability = async (req, res) => {
  try {
    const { unit, checkInDate, checkOutDate, excludeReservationId } = req.query;
    if (!unit) return res.status(400).json({ message: "unit is required." });

    const dateError = validateReservationDates({ checkInDate, checkOutDate });
    if (dateError) return res.status(400).json({ message: dateError });

    const confirmedReservation = await Reservation.findConfirmedOverlap({
      unit,
      checkInDate,
      checkOutDate,
      excludeReservationId,
    });

    const availabilityBlock = await AvailabilityBlock.findOne({
      unit,
      deleted: false,
      startDate: { $lt: new Date(checkOutDate) },
      endDate: { $gt: new Date(checkInDate) },
    });

    res.status(200).json({
      available: !confirmedReservation && !availabilityBlock,
      confirmedReservation,
      availabilityBlock,
    });
  } catch (err) {
    console.error("Failed to check Reservation availability:", err);
    res.status(400).json({ err, error: "Failed to check Reservation availability" });
  }
};

const deleteData = async (req, res) => {
  try {
    const result = await Reservation.findByIdAndUpdate(req.params.id, { deleted: true });
    res.status(200).json({ message: "done", result });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

const deleteMany = async (req, res) => {
  try {
    const result = await Reservation.updateMany(
      { _id: { $in: req.body } },
      { $set: { deleted: true } }
    );
    res.status(200).json({ message: "done", result });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

module.exports = { index, add, view, edit, availability, deleteData, deleteMany };
