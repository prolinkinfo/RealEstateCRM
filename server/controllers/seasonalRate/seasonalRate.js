const SeasonalRate = require("../../model/schema/seasonalRate");

const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Invalid date range.";
  }

  if (start > end) {
    return "endDate must be after startDate.";
  }

  return null;
};

const index = async (req, res) => {
  try {
    const query = { ...req.query, deleted: false };
    const result = await SeasonalRate.find(query).populate("unit createBy").sort({ priority: -1 });
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to get Seasonal Rates:", err);
    res.status(400).json({ err, error: "Failed to get Seasonal Rates" });
  }
};

const add = async (req, res) => {
  try {
    const dateError = validateDateRange(req.body.startDate, req.body.endDate);
    if (dateError) return res.status(400).json({ message: dateError });

    req.body.createdDate = new Date();
    const result = new SeasonalRate(req.body);
    await result.save();
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to create Seasonal Rate:", err);
    res.status(400).json({ err, error: "Failed to create Seasonal Rate" });
  }
};

const view = async (req, res) => {
  try {
    const result = await SeasonalRate.findOne({ _id: req.params.id, deleted: false })
      .populate("unit createBy");
    if (!result) return res.status(404).json({ message: "no Data Found." });
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to view Seasonal Rate:", err);
    res.status(400).json({ err, error: "Failed to view Seasonal Rate" });
  }
};

const edit = async (req, res) => {
  try {
    if (req.body.startDate || req.body.endDate) {
      const existing = await SeasonalRate.findOne({ _id: req.params.id, deleted: false });
      if (!existing) return res.status(404).json({ message: "no Data Found." });

      const dateError = validateDateRange(
        req.body.startDate || existing.startDate,
        req.body.endDate || existing.endDate
      );
      if (dateError) return res.status(400).json({ message: dateError });
    }

    req.body.updatedDate = new Date();
    const result = await SeasonalRate.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { $set: req.body },
      { new: true }
    );
    if (!result) return res.status(404).json({ message: "no Data Found." });
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to update Seasonal Rate:", err);
    res.status(400).json({ err, error: "Failed to update Seasonal Rate" });
  }
};

const deleteData = async (req, res) => {
  try {
    const result = await SeasonalRate.findByIdAndUpdate(req.params.id, { deleted: true });
    res.status(200).json({ message: "done", result });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

const deleteMany = async (req, res) => {
  try {
    const result = await SeasonalRate.updateMany(
      { _id: { $in: req.body } },
      { $set: { deleted: true } }
    );
    res.status(200).json({ message: "done", result });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

module.exports = { index, add, view, edit, deleteData, deleteMany };
