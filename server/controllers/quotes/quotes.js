const Quotes = require("../../model/schema/quotes.js");
const mongoose = require("mongoose");
const User = require('../../model/schema/user')



async function getNextAutoIncrementValue() {
    const num = await Quotes.countDocuments({});
    return num + 1;
}

const index = async (req, res) => {
    query = req.query;
    query.deleted = false;
    const user = await User.findById(req.user.userId)
    if (user?.role !== "superAdmin") {
        delete query.createBy
        query.$or = [{ createBy: new mongoose.Types.ObjectId(req.user.userId) }, { assignUser: new mongoose.Types.ObjectId(req.user.userId) }];
    }

    try {
        let result = await Quotes.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "Contacts",
                    localField: "contact",
                    foreignField: "_id",
                    as: "contactData",
                },
            },
            {
                $lookup: {
                    from: "Accounts",
                    localField: "account",
                    foreignField: "_id",
                    as: "accountData",
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
            {
                $lookup: {
                    from: "User",
                    localField: "modifiedBy",
                    foreignField: "_id",
                    as: "modifiedByUser",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedToData",
                },
            },
            { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$contactData", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$accountData", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$modifiedByUser', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$assignedToData", preserveNullAndEmptyArrays: true } },
            { $match: { "users.deleted": false } },
            {
                $addFields: {
                    assignUserName: {
                        $cond: {
                            if: '$assignUsers',
                            then: { $concat: ['$assignUsers.firstName', ' ', '$assignUsers.lastName'] },
                            else: { $concat: [''] }
                        }
                    },
                    createdByName: { $concat: ['$users.firstName', ' ', '$users.lastName'] },
                    modifiedUserName: { $concat: ['$modifiedByUser.firstName', ' ', '$modifiedByUser.lastName'] },
                    contactName: { $concat: ['$contactData.firstName', ' ', '$contactData.lastName'] },
                    accountName: '$accountData.name'
                }
            },
            { $project: { users: 0, contactData: 0, accountData: 0, modifiedByUser: 0, assignedToData: 0 } },
        ]);
        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

const add = async (req, res) => {
    try {
        const nextAutoIncrementValue = await getNextAutoIncrementValue();
        const result = new Quotes({ ...req.body, quoteNumber: nextAutoIncrementValue });
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
const addMany = async (req, res) => {
    try {
        const data = req.body.map((item) => ({
            ...item,
            account: item.account ? item.account : null,
            contact: item.contact ? item.contact : null,
        }))
        const inserted = await Quotes.insertMany(data);

        res.status(200).json(inserted);
    } catch (err) {
        console.error('Failed to create Quotes :', err);
        res.status(400).json({ error: 'Failed to create Quotes' });
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
                    from: "Opportunities",
                    localField: "oppotunity",
                    foreignField: "_id",
                    as: "oppotunityData",
                },
            },
            {
                $lookup: {
                    from: "Contacts",
                    localField: "contact",
                    foreignField: "_id",
                    as: "contactData",
                },
            },
            {
                $lookup: {
                    from: "Accounts",
                    localField: "account",
                    foreignField: "_id",
                    as: "accountData",
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
            {
                $lookup: {
                    from: "User",
                    localField: "modifiedBy",
                    foreignField: "_id",
                    as: "modifiedByUser",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedToData",
                },
            },
            { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$contactData", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$accountData", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$modifiedByUser', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$assignedToData", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$oppotunityData", preserveNullAndEmptyArrays: true } },
            { $match: { "users.deleted": false } },
            {
                $addFields: {
                    assignUserName: {
                        $cond: {
                            if: '$assignedToData',
                            then: { $concat: ['$assignedToData.firstName', ' ', '$assignedToData.lastName'] },
                            else: { $concat: [''] }
                        }
                    },
                    oppotunityName: '$oppotunityData.opportunityName',
                    createdByName: { $concat: ['$users.firstName', ' ', '$users.lastName'] },
                    modifiedUserName: { $concat: ['$modifiedByUser.firstName', ' ', '$modifiedByUser.lastName'] },
                    contactName: { $concat: ['$contactData.firstName', ' ', '$contactData.lastName'] },
                    accountName: '$accountData.name'
                }
            },
            { $project: { users: 0, contactData: 0, accountData: 0, modifiedByUser: 0, oppotunityData: 0, assignedToData: 0 } },
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

module.exports = { index, add, edit, addMany, view, deleteData, deleteMany };
