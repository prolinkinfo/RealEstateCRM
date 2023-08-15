const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        const result = new MeetingHistory(req.body);
        await result.save();
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create :', err);
        res.status(400).json({ err, error: 'Failed to create' });
    }
}

const index = async (req, res) => {
    try {
        const query = req.query
        if (query.createdBy) {
            query.createdBy = new mongoose.Types.ObjectId(query.createdBy);
        }

        const meetings = await MeetingHistory.aggregate([
            { $match: query },
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
            },
        ]);

        res.status(200).json(meetings);
    } catch (err) {
        console.error('Failed :', err);
        res.status(400).json({ err, error: 'Failed ' });
    }
}

const view = async (req, res) => {
    try {
        let result = await MeetingHistory.findOne({ _id: req.params.id })

        if (!result) return res.status(404).json({ message: "no Data Found." })

        let response = await MeetingHistory.aggregate([
            { $match: { _id: result._id } },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'attendes',
                    foreignField: '_id',
                    as: 'attendes'
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
                    // attendesArray: '$contact.email',
                    createdByName: '$users.username',
                }
            },
            {
                $project: {
                    // contact: 0,
                    users: 0
                }
            },
        ])

        res.status(200).json(response[0])
    } catch (err) {
        console.error('Failed :', err);
        res.status(400).json({ err, error: 'Failed ' });
    }
}

module.exports = { add, index, view }