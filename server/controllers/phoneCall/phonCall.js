const PhoneCall = require("../../model/schema/phoneCall");
const User = require("../../model/schema/user");
const mongoose = require("mongoose");

const add = async (req, res) => {
    try {
        const {
            sender,
            recipient,
            callDuration,
            startDate,
            callNotes,
            createByContact,
            createBy,
            createByLead,
            salesAgent,
            property,
        } = req.body;

        if (createByContact && !mongoose.Types.ObjectId.isValid(createByContact)) {
            res.status(400).json({ error: "Invalid createByContact value" });
        }
        if (createByLead && !mongoose.Types.ObjectId.isValid(createByLead)) {
            res.status(400).json({ error: "Invalid createByLead value" });
        }
        if (salesAgent && !mongoose.Types.ObjectId.isValid(salesAgent)) {
            res.status(400).json({ error: "Invalid salesAgent value" });
        }

        const phoneCall = {
            sender,
            recipient,
            callDuration,
            startDate,
            callNotes,
            property,
            createBy,
            salesAgent: new mongoose.Types.ObjectId(salesAgent) || null,
        };

        if (createByContact) {
            phoneCall.createByContact = createByContact;
        }

        if (createByLead) {
            phoneCall.createByLead = createByLead;
        }
        const user = await User.findById({ _id: phoneCall.sender });
        user.outboundcall = user.outboundcall + 1;
        await user.save();

        const result = new PhoneCall(phoneCall);
        await result.save();
        res.status(200).json({ result });
    } catch (err) {
        console.error("Failed to create :", err);
        res.status(400).json({ err, error: "Failed to create" });
    }
};

const index = async (req, res) => {
    try {
        const query = req.query;
        if (query.sender) {
            query.sender = new mongoose.Types.ObjectId(query.sender);
        }

        const user = await User.findById(req.user.userId);

        if (user?.role !== "superAdmin") {
            delete query.sender;
            query.deleted = false;
            query.$or = [
                { sender: new mongoose.Types.ObjectId(req.user.userId) },
                { salesAgent: new mongoose.Types.ObjectId(req.user.userId) },
            ];
        }

        let result = await PhoneCall.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "Leads", // Assuming this is the collection name for 'leads'
                    localField: "createByLead",
                    foreignField: "_id",
                    as: "createByrefLead",
                },
            },
            {
                $lookup: {
                    from: "Contacts",
                    localField: "createByContact",
                    foreignField: "_id",
                    as: "contact",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "sender",
                    foreignField: "_id",
                    as: "users",
                },
            },
            { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$contact", preserveNullAndEmptyArrays: true } },
            {
                $unwind: { path: "$createByrefLead", preserveNullAndEmptyArrays: true },
            },
            { $match: { "users.deleted": false } },
            {
                $addFields: {
                    senderName: { $concat: ["$users.firstName", " ", "$users.lastName"] },
                    deleted: {
                        $cond: [
                            { $eq: ["$contact.deleted", false] },
                            "$contact.deleted",
                            { $ifNull: ["$createByrefLead.deleted", false] },
                        ],
                    },
                    createByName: {
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
                            else: { $concat: ["$createByrefLead.leadName"] },
                        },
                    },
                },
            },
            { $project: { contact: 0, createByrefLead: 0, users: 0, salesAgent: 0 } },
        ]);

        res.status(200).json(result);
    } catch (err) {
        console.error("Failed :", err);
        res.status(400).json({ err, error: "Failed " });
    }
};

const view = async (req, res) => {
    try {
        let result = await PhoneCall.findOne({ _id: req.params.id });

        if (!result) return res.status(404).json({ message: "no Data Found." });

        let response = await PhoneCall.aggregate([
            { $match: { _id: result._id } },
            {
                $lookup: {
                    from: "Contacts",
                    localField: "createByContact",
                    foreignField: "_id",
                    as: "contact",
                },
            },
            {
                $lookup: {
                    from: "Leads", // Assuming this is the collection name for 'leads'
                    localField: "createByLead",
                    foreignField: "_id",
                    as: "createByrefLead",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "sender",
                    foreignField: "_id",
                    as: "users",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "salesAgent",
                    foreignField: "_id",
                    as: "salesAgent",
                },
            },
            {
                $lookup: {
                    from: "Properties",
                    localField: "property",
                    foreignField: "_id",
                    as: "properties",
                },
            },
            { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$contact", preserveNullAndEmptyArrays: true } },
            {
                $unwind: { path: "$createByrefLead", preserveNullAndEmptyArrays: true },
            },
            { $unwind: { path: "$salesAgent", preserveNullAndEmptyArrays: true } },
            { $match: { "users.deleted": false } },
            {
                $addFields: {
                    senderName: { $concat: ["$users.firstName", " ", "$users.lastName"] },
                    deleted: {
                        $cond: [
                            { $eq: ["$contact.deleted", false] },
                            "$contact.deleted",
                            { $ifNull: ["$createByrefLead.deleted", false] },
                        ],
                    },
                    createByName: {
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
                            else: { $concat: ["$createByrefLead.leadName"] },
                        },
                    },
                    salesAgentName: {
                        $cond: {
                            if: { $ne: ["$salesAgent", null] },
                            then: {
                                $concat: ["$salesAgent.firstName", " ", "$salesAgent.lastName"],
                            },
                            else: "",
                        },
                    },
                },
            },
            { $project: { contact: 0, createByrefLead: 0, users: 0, salesAgent: 0 } },
        ]);

        res.status(200).json(response[0]);
    } catch (err) {
        console.error("Failed :", err);
        res.status(400).json({ err, error: "Failed " });
    }
};

module.exports = { add, index, view };
