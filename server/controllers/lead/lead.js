const Lead = require('../../model/schema/lead')
const EmailHistory = require('../../model/schema/email');
const PhoneCall = require('../../model/schema/phoneCall');
const Task = require('../../model/schema/task')
const MeetingHistory = require('../../model/schema/meeting')

const index = async (req, res) => {
    const query = req.query
    query.deleted = false;

    // let result = await Lead.find(query)

    let allData = await Lead.find(query).populate({
        path: 'createBy',
        match: { deleted: false } // Populate only if createBy.deleted is false
    }).exec()

    const result = allData.filter(item => item.createBy !== null);
    res.send(result)
}

const add = async (req, res) => {
    try {
        const user = new Lead(req.body);
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error('Failed to create Lead:', err);
        res.status(400).json({ error: 'Failed to create Lead' });
    }
}

const edit = async (req, res) => {
    try {
        let result = await Lead.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to Update Lead:', err);
        res.status(400).json({ error: 'Failed to Update Lead' });
    }
}

const view = async (req, res) => {
    let lead = await Lead.findOne({ _id: req.params.id })

    let query = req.query
    if (query.sender) {
        query.sender = new mongoose.Types.ObjectId(query.sender);
    }
    query.createByLead = req.params.id

    let Email = await EmailHistory.aggregate([
        { $match: { createByLead: lead._id } },
        {
            $lookup: {
                from: 'leads', // Assuming this is the collection name for 'leads'
                localField: 'createByLead',
                foreignField: '_id',
                as: 'createByrefLead'
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
        { $unwind: { path: '$createByRef', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$createByrefLead', preserveNullAndEmptyArrays: true } },
        { $match: { 'users.deleted': false } },
        {
            $addFields: {
                senderName: { $concat: ['$users.firstName', ' ', '$users.lastName'] },
                deleted: {
                    $cond: [
                        { $eq: ['$createByRef.deleted', false] },
                        '$createByRef.deleted',
                        { $ifNull: ['$createByrefLead.deleted', false] }
                    ]
                },
                createByName: {
                    $cond: {
                        if: '$createByRef',
                        then: { $concat: ['$createByRef.title', ' ', '$createByRef.firstName', ' ', '$createByRef.lastName'] },
                        else: { $concat: ['$createByrefLead.leadName'] }
                    }
                },
            }
        },
        {
            $project: {
                createByRef: 0,
                createByrefLead: 0,
                users: 0
            }
        },
    ])

    let phoneCall = await PhoneCall.aggregate([
        { $match: { createByLead: lead._id } },
        {
            $lookup: {
                from: 'leads', // Assuming this is the collection name for 'leads'
                localField: 'createByLead',
                foreignField: '_id',
                as: 'createByrefLead'
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
        { $unwind: { path: '$createByrefLead', preserveNullAndEmptyArrays: true } },
        { $match: { 'users.deleted': false } },
        {
            $addFields: {
                senderName: { $concat: ['$users.firstName', ' ', '$users.lastName'] },
                deleted: '$createByrefLead.deleted',
                createByName: '$createByrefLead.leadName',
            }
        },
        { $project: { createByrefLead: 0, users: 0 } },
    ])

    let task = await Task.aggregate([
        { $match: { assignmentToLead: lead._id } },
        {
            $lookup: {
                from: 'lead',
                localField: 'assignmentToLead',
                foreignField: '_id',
                as: 'lead'
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
        { $unwind: { path: '$lead', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                assignmentToName: lead.leadName,
                createByName: '$users.username',
            }
        },
        { $project: { lead: 0, users: 0 } },
    ])

    let meeting = await MeetingHistory.aggregate([
        {
            $match: {
                $expr: {
                    $and: [
                        { $in: [lead._id, '$attendesLead'] },
                    ]
                }
            }
        },
        {
            $lookup: {
                from: 'lead',
                localField: 'assignmentToLead',
                foreignField: '_id',
                as: 'lead'
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
                attendesArray: '$lead.leadEmail',
                createdByName: '$users.username',
            }
        },
        {
            $project: {
                users: 0
            }
        }
    ]);
    if (!lead) return res.status(404).json({ message: "no Data Found." })
    res.status(200).json({ lead, Email, phoneCall, task, meeting })
}

const deleteData = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", lead })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const lead = await Lead.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });
        res.status(200).json({ message: "done", lead })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

module.exports = { index, add, view, edit, deleteData, deleteMany }