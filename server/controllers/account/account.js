const Account = require('../../model/schema/account')
const mongoose = require('mongoose');
const User = require('../../model/schema/user');

const add = async (req, res) => {
    try {
        const result = new Account(req.body);
        await result.save();
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create :', err);
        res.status(400).json({ err, error: 'Failed to create' });
    }
}
const addMany = async (req, res) => {
    try {
        const data = req.body;
        const insertedAccount = await Account.insertMany(data);

        res.status(200).json(insertedAccount);
    } catch (err) {
        console.error('Failed to create Account :', err);
        res.status(400).json({ error: 'Failed to create Account' });
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

        const result = await Account.aggregate([
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
                    localField: 'memberOf',
                    foreignField: '_id',
                    as: 'memberOfList'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$assignUsers', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$modifiedByUser', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$memberOfList', preserveNullAndEmptyArrays: true } },
            { $match: { 'users.deleted': false } },
            // { $match: { 'assignUsers.deleted': false } },
            { $match: { 'modifiedByUser.deleted': false } },
            {
                $addFields: {
                    createdByName: { $concat: ['$users.firstName', ' ', '$users.lastName'] },
                    assignUserName: {
                        $cond: {
                            if: '$assignUsers',
                            then: { $concat: ['$assignUsers.firstName', ' ', '$assignUsers.lastName'] },
                            else: { $concat: [''] }
                        }
                    },
                    modifiedUserName: { $concat: ['$modifiedByUser.firstName', ' ', '$modifiedByUser.lastName'] },
                    memberOfName: {
                        $cond: {
                            if: '$memberOfList',
                            then: '$memberOfList.name',
                            else: ''
                        }
                    },
                }
            },
            {
                $project: {
                    users: 0,
                    assignUsers: 0,
                    modifiedByUser: 0,
                    memberOfList: 0,
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
        let result = await Account.findOne({ _id: req.params.id })
        if (!result) return res.status(404).json({ message: "no Data Found." })

        let response = await Account.aggregate([
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
                    localField: 'memberOf',
                    foreignField: '_id',
                    as: 'memberOfList'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$assignUsers', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$modifiedByUser', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$memberOfList', preserveNullAndEmptyArrays: true } },
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
                    memberOfName: {
                        $cond: {
                            if: '$memberOfList',
                            then: { $concat: ['$memberOfList.name'] },
                            else: { $concat: [''] }
                        }
                    },
                }
            },
            {
                $project: {
                    users: 0,
                    assignUsers: 0,
                    modifiedByUser: 0,
                    memberOfList: 0,
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

        let result = await Account.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create Account:', err);
        res.status(400).json({ error: 'Failed to create Account : ', err });
    }
}
const deleteData = async (req, res) => {
    try {
        const result = await Account.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", result: result })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const result = await Account.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });
        res.status(200).json({ message: "done", result })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

module.exports = { add, index, view, deleteData, edit, deleteMany, addMany }