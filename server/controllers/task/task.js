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
                    from: 'Contact',
                    localField: 'assignmentTo',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'Lead', // Assuming this is the collection name for 'leads'
                    localField: 'assignmentToLead',
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
                    assignmentToName: {
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
        const { title, category, description, notes, reminder, start, end, backgroundColor, borderColor, textColor, display, url, allDay, createBy, assignmentTo, assignmentToLead } = req.body;
        // Check if assignmentTo is a valid ObjectId if provided and not empty
        if (assignmentTo && !mongoose.Types.ObjectId.isValid(assignmentTo)) {
            res.status(400).json({ error: 'Invalid assignmentTo value' });
        }
        if (assignmentToLead && !mongoose.Types.ObjectId.isValid(assignmentToLead)) {
            res.status(400).json({ error: 'Invalid assignmentToLead value' });
        }
        const taskData = { title, category, description, notes, reminder, start, end, backgroundColor, borderColor, textColor, display, url, createBy, allDay, createdDate: new Date() };

        if (assignmentTo) {
            taskData.assignmentTo = assignmentTo;
        }
        if (assignmentToLead) {
            taskData.assignmentToLead = assignmentToLead;
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
        const { title, category, description, notes, reminder, start, end, backgroundColor, borderColor, textColor, display, url, createBy, assignmentTo, status, allDay } = req.body;

        if (assignmentTo && !mongoose.Types.ObjectId.isValid(assignmentTo)) {
            res.status(400).json({ error: 'Invalid assignmentTo value' });
        }
        const taskData = { title, category, description, notes, reminder, start, end, backgroundColor, borderColor, textColor, display, url, createBy, status, allDay };

        if (assignmentTo) {
            taskData.assignmentTo = assignmentTo;
        }
        // let result = await Task.updateOne(
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

        let result = await Task.updateOne(
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
                    from: 'Contact',
                    localField: 'assignmentTo',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'Lead', // Assuming this is the collection name for 'leads'
                    localField: 'assignmentToLead',
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
                    assignmentToName: {
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