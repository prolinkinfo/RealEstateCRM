const Task = require('../../model/schema/task')
const mongoose = require('mongoose');

const index = async (req, res) => {
    query = req.query;
    query.deleted = false;
    if (query.createBy) {
        query.createBy = new mongoose.Types.ObjectId(query.createBy);
    }

    try {
        let result = await Task.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'Contacts',
                    localField: 'assignTo',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'Leads', // Assuming this is the collection name for 'leads'
                    localField: 'assignToLead',
                    foreignField: '_id',
                    as: 'Lead'
                }
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$contact', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$Lead', preserveNullAndEmptyArrays: true } },
            { $match: { 'users.deleted': false } },
            {
                $addFields: {
                    assignToName: {
                        $cond: {
                            if: '$contact',
                            then: { $concat: ['$contact.title', ' ', '$contact.firstName', ' ', '$contact.lastName'] },
                            else: { $concat: ['$Lead.leadName'] }
                        }
                    },
                }
            },
            { $project: { users: 0, contact: 0, Lead: 0 } },
        ]);
        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
}

const add = async (req, res) => {
    try {
        const { title, category, description, notes, reminder, start, end, backgroundColor, borderColor, textColor, display, url, allDay, createBy, assignTo, assignToLead } = req.body;
        // Check if assignTo is a valid ObjectId if provided and not empty
        if (assignTo && !mongoose.Types.ObjectId.isValid(assignTo)) {
            res.status(400).json({ error: 'Invalid assignTo value' });
        }
        if (assignToLead && !mongoose.Types.ObjectId.isValid(assignToLead)) {
            res.status(400).json({ error: 'Invalid assignToLead value' });
        }
        const taskData = { title, category, description, notes, reminder, start, end, backgroundColor, borderColor, textColor, display, url, createBy, allDay, createdDate: new Date() };

        if (assignTo) {
            taskData.assignTo = assignTo;
        }
        if (assignToLead) {
            taskData.assignToLead = assignToLead;
        }
        const result = new Task(taskData);
        await result.save();
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create task:', err);
        res.status(400).json({ error: 'Failed to create task : ', err });
    }
}

const edit = async (req, res) => {
    try {
        const { title, category, description, notes, reminder, start, end, backgroundColor, borderColor, assignToLead, textColor, display, url, createBy, assignTo, status, allDay } = req.body;

        if (assignTo && !mongoose.Types.ObjectId.isValid(assignTo)) {
            res.status(400).json({ error: 'Invalid Assign To value' });
        }
        if (assignToLead && !mongoose.Types.ObjectId.isValid(assignToLead)) {
            res.status(400).json({ error: 'Invalid Assign To Lead value' });
        }
        const taskData = { title, assignTo, assignToLead, category, description, notes, reminder, start, end, backgroundColor, borderColor, textColor, display, url, createBy, status, allDay };

        let result = await Task.findOneAndUpdate(
            { _id: req.params.id },
            { $set: taskData },
            { new: true }
        );

        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create task:', err);
        res.status(400).json({ error: 'Failed to create task : ', err });
    }
}
const changeStatus = async (req, res) => {
    try {
        const { status } = req.body;

        await Task.updateOne(
            { _id: req.params.id },
            { $set: { status: status } }
        );

        let response = await Task.findOne({ _id: req.params.id })
        res.status(200).json(response);
    } catch (err) {
        console.error('Failed to change status:', err);
        res.status(400).json({ error: 'Failed to change status : ', err });
    }
}

const view = async (req, res) => {
    try {
        let response = await Task.findOne({ _id: req.params.id })
        if (!response) return res.status(404).json({ message: "no Data Found." })
        let result = await Task.aggregate([
            { $match: { _id: response._id } },
            {
                $lookup: {
                    from: 'Contacts',
                    localField: 'assignTo',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'Leads', // Assuming this is the collection name for 'leads'
                    localField: 'assignToLead',
                    foreignField: '_id',
                    as: 'Lead'
                }
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$contact', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$Lead', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    assignToName: {
                        $cond: {
                            if: '$contact',
                            then: { $concat: ['$contact.title', ' ', '$contact.firstName', ' ', '$contact.lastName'] },
                            else: { $concat: ['$Lead.leadName'] }
                        }
                    },
                    createByName: '$users.username',
                }
            },
            { $project: { contact: 0, users: 0, Lead: 0 } },
        ])
        res.status(200).json(result[0]);

    } catch (err) {
        console.log('Error:', err);
        res.status(400).json({ Error: err });
    }
}

const deleteData = async (req, res) => {
    try {
        const result = await Task.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", result })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const result = await Task.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });

        if (result?.matchedCount > 0 && result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Tasks Removed successfully", result });
        }
        else {
            return res.status(404).json({ success: false, message: "Failed to remove tasks" })
        }

    } catch (err) {
        return res.status(404).json({ success: false, message: "error", err });
    }
}

module.exports = { index, add, edit, view, deleteData, changeStatus, deleteMany }