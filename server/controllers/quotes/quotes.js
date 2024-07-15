const Quotes = require("../../model/schema/quotes.js");
const mongoose = require("mongoose");

const index = async (req, res) => {
    query = req.query;
    query.deleted = false;
    if (query.createBy) {
        query.createBy = new mongoose.Types.ObjectId(query.createBy);
    }

    try {
        let result = await Quotes.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "Contacts",
                    localField: "assignTo",
                    foreignField: "_id",
                    as: "contact",
                },
            },
            {
                $lookup: {
                    from: "Leads", // Assuming this is the collection name for 'leads'
                    localField: "assignToLead",
                    foreignField: "_id",
                    as: "Lead",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "createBy",
                    foreignField: "_id",
                    as: "users",
                },
            },
            { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$contact", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$Lead", preserveNullAndEmptyArrays: true } },
            { $match: { "users.deleted": false } },
            {
                $addFields: {
                    assignToName: {
                        $cond: {
                            if: "$contact",
                            then: {
                                $concat: [
                                    "$contact.title",
                                    " ",
                                    "$contact.firstName",
                                    " ",
                                    "$contact.lastName",
                                ],
                            },
                            else: { $concat: ["$Lead.leadName"] },
                        },
                    },
                },
            },
            { $project: { users: 0, contact: 0, Lead: 0 } },
        ]);
        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

const add = async (req, res) => {
    try {

        const result = new Quotes(req.body);
        await result.save();
        res.status(200).json(result);
    } catch (err) {
        console.error("Failed to create Quotes:", err);
        res.status(400).json({ error: "Failed to create Quotes : ", err });
    }
};

const edit = async (req, res) => {
    try {

        let result = await Quotes.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(result);
    } catch (err) {
        console.error("Failed to create Quotes:", err);
        res.status(400).json({ error: "Failed to create Quotes : ", err });
    }
};

const view = async (req, res) => {
    try {
        let response = await Quotes.findOne({ _id: req.params.id });
        if (!response) return res.status(404).json({ message: "no Data Found." });
        let result = await Quotes.aggregate([
            { $match: { _id: response._id } },
            {
                $lookup: {
                    from: "Contacts",
                    localField: "assignTo",
                    foreignField: "_id",
                    as: "contact",
                },
            },
            {
                $lookup: {
                    from: "Leads", // Assuming this is the collection name for 'leads'
                    localField: "assignToLead",
                    foreignField: "_id",
                    as: "Lead",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "createBy",
                    foreignField: "_id",
                    as: "users",
                },
            },
            { $unwind: { path: "$contact", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$Lead", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    assignToName: {
                        $cond: {
                            if: "$contact",
                            then: {
                                $concat: [
                                    "$contact.title",
                                    " ",
                                    "$contact.firstName",
                                    " ",
                                    "$contact.lastName",
                                ],
                            },
                            else: { $concat: ["$Lead.leadName"] },
                        },
                    },
                    createByName: "$users.username",
                },
            },
            { $project: { contact: 0, users: 0, Lead: 0 } },
        ]);
        res.status(200).json(result[0]);
    } catch (err) {
        console.log("Error:", err);
        res.status(400).json({ Error: err });
    }
};

const deleteData = async (req, res) => {
    try {
        const result = await Quotes.findByIdAndUpdate(req.params.id, {
            deleted: true,
        });
        res.status(200).json({ message: "done", result });
    } catch (err) {
        res.status(404).json({ message: "error", err });
    }
};

const deleteMany = async (req, res) => {
    try {
        const result = await Quotes.updateMany(
            { _id: { $in: req.body } },
            { $set: { deleted: true } }
        );

        if (result?.matchedCount > 0 && result?.modifiedCount > 0) {
            return res
                .status(200)
                .json({ message: "Quotes Removed successfully", result });
        } else {
            return res
                .status(404)
                .json({ success: false, message: "Failed to remove Quotes" });
        }
    } catch (err) {
        return res.status(404).json({ success: false, message: "error", err });
    }
};

module.exports = { index, add, edit, view, deleteData, deleteMany };
