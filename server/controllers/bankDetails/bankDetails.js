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

module.exports = { index, add };
