const Contact = require('../../model/schema/contact')
const emailHistory = require('../../model/schema/email')
const MeetingHistory = require('../../model/schema/meeting')
const phoneCall = require('../../model/schema/phoneCall')
const Task = require('../../model/schema/task')
const TextMsg = require('../../model/schema/textMsg')

const index = async (req, res) => {
    const query = req.query
    query.deleted = false;

    let allData = await Contact.find(query).populate({
        path: 'createBy',
        match: { deleted: false } // Populate only if createBy.deleted is false
    }).exec()

    const result = allData.filter(item => item.createBy !== null);

    try {
        res.send(result)
    } catch (error) {
        res.send(error)
    }
}

const add = async (req, res) => {
    try {
        const user = new Contact(req.body);
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error('Failed to create Contact:', err);
        res.status(400).json({ error: 'Failed to create Contact' });
    }
}

const addPropertyInterest = async (req, res) => {
    try {
        const { id } = req.params
        await Contact.updateOne({ _id: id }, { $set: { interestProperty: req.body } });
        res.send(' uploaded successfully.');
    } catch (err) {
        console.error('Failed to create Contact:', err);
        res.status(400).json({ error: 'Failed to create Contact' });
    }
}

const edit = async (req, res) => {
    try {
        let result = await Contact.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to Update Contact:', err);
        res.status(400).json({ error: 'Failed to Update Contact' });
    }
}

const view = async (req, res) => {
    try {
        let contact = await Contact.findOne({ _id: req.params.id });
        let interestProperty = await Contact.findOne({ _id: req.params.id }).populate("interestProperty")

        if (!contact) return res.status(404).json({ message: 'No data found.' })
        let EmailHistory = await emailHistory.aggregate([
            { $match: { createBy: contact._id } },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'createdBy'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    sender: '$users.username',
                    recipient: '$recipient',
                    createBy: { $concat: [{ $arrayElemAt: ['$createdBy.title', 0] }, ' ', { $arrayElemAt: ['$createdBy.firstName', 0] }, ' ', { $arrayElemAt: ['$createdBy.lastName', 0] }] },
                    timestamp: '$timestamp',
                }
            }
            // --------------------------
            // {
            //     $lookup: {
            //         from: 'contacts',
            //         localField: '_id',
            //         foreignField: '_id',
            //         as: 'user'
            //     }
            // },
            // {
            //     $lookup: {
            //         from: 'contacts',
            //         let: { createdBy: '$createBy' },
            //         pipeline: [
            //             {
            //                 $match: {
            //                     $expr: { $eq: ['$_id', '$$createdBy'] }
            //                 }
            //             },
            //             {
            //                 $project: {
            //                     _id: 0,
            //                     firstName: 1,
            //                     lastName: 1,
            //                     emailHistory: 1
            //                 }
            //             }
            //         ],
            //         as: 'createdBy'
            //     }
            // }
            // ----------------------------
            // {
            //     $lookup: {
            //         from: 'contacts',
            //         let: { createdBy: '$createBy' }, // Create a variable to hold the 'createBy' field value
            //         pipeline: [
            //             {
            //                 $match: {
            //                     $expr: { $eq: ['$_id', '$$createdBy'] } // Use the variable to match the '_id' field in the 'contacts' collection
            //                 }
            //             },
            //             {
            //                 $project: {
            //                     _id: 0,
            //                     firstName: 1,
            //                     lastName: 1
            //                 }
            //             }
            //         ],
            //         as: 'createdBy'
            //     }
            // }
            // ------------------------
            // {
            //     $project: {
            //         _id: '$emailHistory._id',
            //         sender: '$emailHistory.sender',
            //         recipient: '$emailHistory.recipient',
            //         addedBy: '$emailHistory.timestamp',
            //     }
            // }
        ]);
        let phoneCallHistory = await phoneCall.aggregate([
            { $match: { createBy: contact._id } },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: '$contact' },
            { $match: { 'contact.deleted': false } },
            {
                $addFields: {
                    sender: '$users.username',
                    deleted: '$contact.deleted',
                    createByName: { $concat: ['$contact.title', ' ', '$contact.firstName', ' ', '$contact.lastName'] },
                }
            },
            {
                $project: { contact: 0, users: 0 }
            },
        ]);
        let meetingHistory = await MeetingHistory.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $in: [contact._id, '$attendes'] },
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'attendes',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    attendesArray: '$contact.email',
                    createdByName: '$users.username',
                }
            },
            {
                $project: {
                    contact: 0,
                    users: 0
                }
            }
        ]);
        let textMsg = await TextMsg.aggregate([
            { $match: { createFor: contact._id } },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'createFor',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: '$contact' },
            { $match: { 'contact.deleted': false } },
            {
                $addFields: {
                    sender: '$users.username',
                    deleted: '$contact.deleted',
                    createByName: { $concat: ['$contact.title', ' ', '$contact.firstName', ' ', '$contact.lastName'] },
                }
            },
            {
                $project: { contact: 0, users: 0 }
            },
        ]);

        let task = await Task.aggregate([
            { $match: { assignmentTo: contact._id } },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'assignmentTo',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$contact', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    assignmentToName: '$contact.email',
                    createByName: '$users.username',
                }
            },
            { $project: { contact: 0, users: 0 } },
        ])


        res.status(200).json({ interestProperty, contact, EmailHistory, phoneCallHistory, meetingHistory, textMsg, task });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error, err: 'An error occurred.' });
    }
}

const deleteData = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", contact })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const contact = await Contact.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });
        res.status(200).json({ message: "done", contact })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

module.exports = { index, add, addPropertyInterest, view, edit, deleteData, deleteMany }