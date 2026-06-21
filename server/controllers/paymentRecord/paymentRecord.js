const Payment = require("../../model/schema/payment");

const index = async (req, res) => {
  try {
    const query = { ...req.query, deleted: false };
    const result = await Payment.find(query)
      .populate("reservation guest unit owner collectedBy createBy")
      .sort({ dueDate: 1, paymentDate: 1 });
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to get Rental Payments:", err);
    res.status(400).json({ err, error: "Failed to get Rental Payments" });
  }
};

const add = async (req, res) => {
  try {
    req.body.createdDate = new Date();
    const result = new Payment(req.body);
    await result.save();
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to create Rental Payment:", err);
    res.status(400).json({ err, error: "Failed to create Rental Payment" });
  }
};

const view = async (req, res) => {
  try {
    const result = await Payment.findOne({ _id: req.params.id, deleted: false })
      .populate("reservation guest unit owner collectedBy createBy");
    if (!result) return res.status(404).json({ message: "no Data Found." });
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to view Rental Payment:", err);
    res.status(400).json({ err, error: "Failed to view Rental Payment" });
  }
};

const edit = async (req, res) => {
  try {
    req.body.updatedDate = new Date();
    const result = await Payment.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { $set: req.body },
      { new: true }
    );
    if (!result) return res.status(404).json({ message: "no Data Found." });
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to update Rental Payment:", err);
    res.status(400).json({ err, error: "Failed to update Rental Payment" });
  }
};

const deleteData = async (req, res) => {
  try {
    const result = await Payment.findByIdAndUpdate(req.params.id, { deleted: true });
    res.status(200).json({ message: "done", result });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

const deleteMany = async (req, res) => {
  try {
    const result = await Payment.updateMany(
      { _id: { $in: req.body } },
      { $set: { deleted: true } }
    );
    res.status(200).json({ message: "done", result });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

module.exports = { index, add, view, edit, deleteData, deleteMany };
