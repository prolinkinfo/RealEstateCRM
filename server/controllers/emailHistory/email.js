const { sendEmail } = require('../../middelwares/mail');
const Email = require('../../model/schema/email');
const User = require('../../model/schema/user');
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        const { sender, recipient, subject, message, startDate, createByContact, createBy, createByLead, html, type } = req.body;

        if (createByContact && !mongoose.Types.ObjectId.isValid(createByContact)) {
            res.status(400).json({ error: 'Invalid createByContact value' });
        }
        if (createByLead && !mongoose.Types.ObjectId.isValid(createByLead)) {
            res.status(400).json({ error: 'Invalid createByLead value' });
        }

        const email = { sender, recipient, subject, message, startDate, createBy, html, type }

        if (createByContact) {
            email.createByContact = createByContact;
        }
        if (createByLead) {
            email.createByLead = createByLead;
        }

        const user = await User.findById({ _id: email.sender });
        user.emailsent = user.emailsent + 1;
        await user.save();

        const result = new Email(email);
        await result.save();
        // sendEmail(email.recipient, email.subject, email.message, email.html)
        res.status(200).json({ result });
    } catch (err) {
        console.error('Failed to create :', err);
        res.status(400).json({ err, error: 'Failed to create' });
    }
}

const index = async (req, res) => {
    try {
        const query = req.query
        if (query.sender) {
            query.sender = new mongoose.Types.ObjectId(query.sender);
        }

        let result = await Email.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'Leads', // Assuming this is the collection name for 'leads'
                    localField: 'createByLead',
                    foreignField: '_id',
                    as: 'createByrefLead'
                }
            },
            {
                $lookup: {
                    from: 'Contacts', // Assuming this is the collection name for 'contacts'
                    localField: 'createByContact',
                    foreignField: '_id',
                    as: 'createByRef'
                }
            },
            {
                $lookup: {
                    from: 'User',
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


        res.status(200).json(result);
    } catch (err) {
        console.error('Failed :', err);
        res.status(400).json({ err, error: 'Failed ' });
    }
}

const view = async (req, res) => {
    try {
        let result = await Email.findOne({ _id: req.params.id })

        if (!result) return res.status(404).json({ message: "no Data Found." })

        let response = await Email.aggregate([
            { $match: { _id: result._id } },
            {
                $lookup: {
                    from: 'Leads', // Assuming this is the collection name for 'leads'
                    localField: 'createByLead',
                    foreignField: '_id',
                    as: 'createByrefLead'
                }
            },
            {
                $lookup: {
                    from: 'Contacts', // Assuming this is the collection name for 'contacts'
                    localField: 'createByContact',
                    foreignField: '_id',
                    as: 'createByRef'
                }
            },
            {
                $lookup: {
                    from: 'User',
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
                    senderEmail: '$users.username',
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

        res.status(200).json(response[0])
    } catch (err) {
        console.error('Failed :', err);
        res.status(400).json({ err, error: 'Failed ' });
    }
}

module.exports = { add, index, view }