const RentalUnit = require("../../model/schema/rentalUnit");
const Reservation = require("../../model/schema/reservation");
const AvailabilityBlock = require("../../model/schema/availabilityBlock");

const validateDateRange = (checkInDate, checkOutDate) => {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Invalid date range.";
  }

  if (start >= end) {
    return "checkOutDate must be after checkInDate.";
  }

  return null;
};

const index = async (req, res) => {
  try {
    const query = { ...req.query, deleted: false };
    const result = await RentalUnit.find(query).populate("owner property createBy");
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to get Rental Units:", err);
    res.status(400).json({ err, error: "Failed to get Rental Units" });
  }
};

const add = async (req, res) => {
  try {
    req.body.createdDate = new Date();
    const result = new RentalUnit(req.body);
    await result.save();
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to create Rental Unit:", err);
    res.status(400).json({ err, error: "Failed to create Rental Unit" });
  }
};

const view = async (req, res) => {
  try {
    const result = await RentalUnit.findOne({ _id: req.params.id, deleted: false })
      .populate("owner property createBy");
    if (!result) return res.status(404).json({ message: "no Data Found." });
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to view Rental Unit:", err);
    res.status(400).json({ err, error: "Failed to view Rental Unit" });
  }
};

const edit = async (req, res) => {
  try {
    req.body.updatedDate = new Date();
    const result = await RentalUnit.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { $set: req.body },
      { new: true }
    );
    if (!result) return res.status(404).json({ message: "no Data Found." });
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to update Rental Unit:", err);
    res.status(400).json({ err, error: "Failed to update Rental Unit" });
  }
};

const availability = async (req, res) => {
  try {
    const { unit, checkInDate, checkOutDate, excludeReservationId } = req.query;
    if (!unit) return res.status(400).json({ message: "unit is required." });

    const dateError = validateDateRange(checkInDate, checkOutDate);
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
    console.error("Failed to check Rental Unit availability:", err);
    res.status(400).json({ err, error: "Failed to check Rental Unit availability" });
  }
};

const deleteData = async (req, res) => {
  try {
    const result = await RentalUnit.findByIdAndUpdate(req.params.id, { deleted: true });
    res.status(200).json({ message: "done", result });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

const deleteMany = async (req, res) => {
  try {
    const result = await RentalUnit.updateMany(
      { _id: { $in: req.body } },
      { $set: { deleted: true } }
    );
    res.status(200).json({ message: "done", result });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

module.exports = { index, add, view, edit, availability, deleteData, deleteMany };
