const EmailTemp = require('../../model/schema/emailTemplate')
const mongoose = require('mongoose');

const index = async (req, res) => {
    try {
        const query = req.query
        query.deleted = false;

        if (query.createBy) {
            query.createBy = new mongoose.Types.ObjectId(query.createBy);
        }

        const result = await EmailTemp.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'User',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $match: { 'users.deleted': false } },
            {
                $addFields: {
                    createdByName: '$users.username',
                }
            },
            {
                $project: {
                    users: 0
                }
            },
        ]);

        res.status(200).json(result);
    } catch (err) {
        console.error('Failed :', err);
        res.status(400).json({ err, error: 'Failed ' });
    }
}

const add = async (req, res) => {
    try {
        const result = new EmailTemp(req.body);
        await result.save();
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create EmailTemp:', err);
        res.status(400).json({ error: 'Failed to create EmailTemp' });
    }
}
const view = async (req, res) => {
    try {
        let result = await EmailTemp.findOne({ _id: req.params.id })
        if (!result) return res.status(404).json({ message: "no Data Found." })
        res.status(200).json(result)
    } catch (err) {
        console.error('Failed :', err);
        res.status(400).json({ err, error: 'Failed ' });
    }
}
const edit = async (req, res) => {
    try {
        let result = await EmailTemp.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to Update EmailTemp:', err);
        res.status(400).json({ error: 'Failed to Update EmailTemp' });
    }
}


const deleteData = async (req, res) => {
    try {
        const result = await EmailTemp.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", result })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const result = await EmailTemp.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });
        res.status(200).json({ message: "done", result })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}


module.exports = { index, add, view, edit, deleteData, deleteMany }