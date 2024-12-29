const mongoose = require("mongoose");
const User = require("../../model/schema/user");
const BankDetails = require("../../model/schema/bankDetails");

const index = async (req, res) => {
    try {
        query = req.query;
        query.deleted = false;

        const user = await User.findById(req.user.userId);
        if (user?.role !== "superAdmin") {
            query.createBy = new mongoose.Types.ObjectId(req.user.userId)
        }

        let result = await BankDetails.find(query);

        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

const add = async (req, res) => {
    try {
        const result = new BankDetails(req.body);
        await result.save();
        res.status(200).json(result);
    } catch (err) {
        console.error("Failed to add BankDetails:", err);
        res.status(400).json({ error: "Failed to add BankDetails: ", err });
    }
};

const edit = async (req, res) => {
    try {
        let result = await BankDetails.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to Update BankDetails:', err);
        res.status(400).json({ error: 'Failed to Update BankDetails' });
    }
}

const view = async (req, res) => {
    try {
        let result = await BankDetails.findOne({ _id: req.params.id })
        if (!result) return res.status(404).json({ message: "no Data Found." })
        res.status(200).json(result)
    } catch (err) {
        console.error('Failed :', err);
        res.status(400).json({ err, error: 'Failed ' });
    }
}

const deleteData = async (req, res) => {
    try {
        const bankDetails = await BankDetails.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", bankDetails })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const bankDetails = await BankDetails.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });
        res.status(200).json({ message: "done", bankDetails })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

module.exports = { index, add , deleteMany , deleteData , edit ,view};
