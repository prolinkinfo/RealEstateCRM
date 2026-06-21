const Owner = require("../../model/schema/owner");

const index = async (req, res) => {
  try {
    const query = { ...req.query, deleted: false };
    const result = await Owner.find(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to get Owners:", err);
    res.status(400).json({ err, error: "Failed to get Owners" });
  }
};

const add = async (req, res) => {
  try {
    req.body.createdDate = new Date();
    const result = new Owner(req.body);
    await result.save();
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to create Owner:", err);
    res.status(400).json({ err, error: "Failed to create Owner" });
  }
};

const view = async (req, res) => {
  try {
    const result = await Owner.findOne({ _id: req.params.id, deleted: false });
    if (!result) return res.status(404).json({ message: "no Data Found." });
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to view Owner:", err);
    res.status(400).json({ err, error: "Failed to view Owner" });
  }
};

const edit = async (req, res) => {
  try {
    req.body.updatedDate = new Date();
    const result = await Owner.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { $set: req.body },
      { new: true }
    );
    if (!result) return res.status(404).json({ message: "no Data Found." });
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to update Owner:", err);
    res.status(400).json({ err, error: "Failed to update Owner" });
  }
};

const deleteData = async (req, res) => {
  try {
    const result = await Owner.findByIdAndUpdate(req.params.id, { deleted: true });
    res.status(200).json({ message: "done", result });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

const deleteMany = async (req, res) => {
  try {
    const result = await Owner.updateMany(
      { _id: { $in: req.body } },
      { $set: { deleted: true } }
    );
    res.status(200).json({ message: "done", result });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

module.exports = { index, add, view, edit, deleteData, deleteMany };
