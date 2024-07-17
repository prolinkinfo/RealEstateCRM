const Opprtunities = require('../../model/schema/opprtunity')
const User = require('../../model/schema/user')
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        const result = new Opprtunities(req.body);
        await result.save();
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create :', err);
        res.status(400).json({ err, error: 'Failed to create' });
    }
}
const addMany = async (req, res) => {
    try {
        const data = req.body.map((item) => ({
            ...item,
            account: item.account ? item.account : null
        }))
        const insertedOppotunity = await Opprtunities.insertMany(data);

        res.status(200).json(insertedOppotunity);
    } catch (err) {
        console.error('Failed to create Opprtunities :', err);
        res.status(400).json({ error: 'Failed to create Opprtunities' });
    }
};
const index = async (req, res) => {
    try {
        const query = req.query
        query.deleted = false;

        const user = await User.findById(req.user.userId)
        if (user?.role !== "superAdmin") {
            delete query.createBy
            query.$or = [{ createBy: new mongoose.Types.ObjectId(req.user.userId) }, { assignUser: new mongoose.Types.ObjectId(req.user.userId) }];
        }

        const result = await Opprtunities.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'User',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'assignUser',
                    foreignField: '_id',
                    as: 'assignUsers'
                }
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'modifiedBy',
                    foreignField: '_id',
                    as: 'modifiedByUser'
                }
            },
            {
                $lookup: {
                    from: 'Accounts',
                    localField: 'accountName',
                    foreignField: '_id',
                    as: 'accountData'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$assignUsers', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$modifiedByUser', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$accountData', preserveNullAndEmptyArrays: true } },
            { $match: { 'users.deleted': false } },
            // { $match: { 'assignUsers.deleted': false } },
            { $match: { 'modifiedByUser.deleted': false } },
            {
                $addFields: {
                    createdByName: { $concat: ['$users.firstName', ' ', '$users.lastName'] },
                    // assignUserName: { $concat: ['$assignUsers.firstName', ' ', '$assignUsers.lastName'] },
                    assignUserName: {
                        $cond: {
                            if: '$assignUsers',
                            then: { $concat: ['$assignUsers.firstName', ' ', '$assignUsers.lastName'] },
                            else: { $concat: [''] }
                        }
                    },
                    modifiedUserName: { $concat: ['$modifiedByUser.firstName', ' ', '$modifiedByUser.lastName'] },
                    accountName2: '$accountData.name'
                }
            },
            {
                $project: {
                    users: 0,
                    assignUsers: 0,
                    modifiedByUser: 0,
                    accountData: 0,
                }
            },
        ]);

        res.status(200).json(result);
    } catch (err) {
        console.error('Failed :', err);
        res.status(400).json({ err, error: 'Failed ' });
    }
}

const view = async (req, res) => {
    try {
        let result = await Opprtunities.findOne({ _id: req.params.id })
        if (!result) return res.status(404).json({ message: "no Data Found." })

        let response = await Opprtunities.aggregate([
            { $match: { _id: result._id } },
            {
                $lookup: {
                    from: 'User',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'assignUser',
                    foreignField: '_id',
                    as: 'assignUsers'
                }
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'modifiedBy',
                    foreignField: '_id',
                    as: 'modifiedByUser'
                }
            },
            {
                $lookup: {
                    from: 'Accounts',
                    localField: 'accountName',
                    foreignField: '_id',
                    as: 'accountData'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$assignUsers', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$modifiedByUser', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$accountData', preserveNullAndEmptyArrays: true } },

            { $match: { 'users.deleted': false } },
            // { $match: { 'assignUsers.deleted': false } },
            { $match: { 'modifiedByUser.deleted': false } },
            {
                $addFields: {
                    createdByName: { $concat: ['$users.firstName', ' ', '$users.lastName'] },
                    // assignUserName: { $concat: ['$assignUsers.firstName', ' ', '$assignUsers.lastName'] },
                    assignUserName: {
                        $cond: {
                            if: '$assignUsers',
                            then: { $concat: ['$assignUsers.firstName', ' ', '$assignUsers.lastName'] },
                            else: { $concat: [''] }
                        }
                    },
                    modifiedUserName: { $concat: ['$modifiedByUser.firstName', ' ', '$modifiedByUser.lastName'] },
                    accountName2: '$accountData.name'
                }
            },
            {
                $project: {
                    users: 0,
                    assignUsers: 0,
                    modifiedByUser: 0,
                    accountData: 0,
                }
            },
        ])

        res.status(200).json(response[0])
    } catch (err) {
        console.error('Failed :', err);
        res.status(400).json({ err, error: 'Failed ' });
    }
}
const edit = async (req, res) => {
    try {

        let result = await Opprtunities.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create Opprtunities:', err);
        res.status(400).json({ error: 'Failed to create Opprtunities : ', err });
    }
}
const deleteData = async (req, res) => {
    try {
        const result = await Opprtunities.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", result: result })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const result = await Opprtunities.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });
        res.status(200).json({ message: "done", result })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

module.exports = { add, index, view, deleteData, edit, deleteMany, addMany }