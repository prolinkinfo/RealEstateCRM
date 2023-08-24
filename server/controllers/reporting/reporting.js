const EmailHistory = require('../../model/schema/email');
const User = require('../../model/schema/user')
const PhoneCall = require('../../model/schema/phoneCall');
const TextMsg = require('../../model/schema/textMsg');
const mongoose = require('mongoose');

const index = async (req, res) => {
    const query = req.query
    query.deleted = false;
    let result = await User.find(query)
    res.send(result)
}

const data = async (req, res) => {
    try {
        // Set the start date and end date
        const startDateString = req.body.startDate;
        const endDateString = req.body.endDate;

        // Convert the startDateString and endDateString to Date objects
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        // Ensure the dates are valid
        if (isNaN(startDate) || isNaN(endDate)) {
            return res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD.' });
        }

        endDate.setHours(23, 59, 59, 999);

        let filter = req.body.filter;

        let matchFilter = {
            timestamp: { $gte: startDate, $lte: endDate }, // Filter documents with timestamp between startDate and endDate
        };
        // matchFilter.deleted = false;
        const query = req.query;
        // Convert sender to ObjectId if provided
        if (query.sender) {
            matchFilter.sender = new mongoose.Types.ObjectId(query.sender);
        }

        let groupFields = {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
        };
        if (filter === "day") {
            groupFields.day = { $dayOfMonth: "$timestamp" };
        } else if (filter === "week") {
            groupFields.week = { $week: "$timestamp" };
        }


        let EmailDetails = await EmailHistory.aggregate([
            { $match: matchFilter },
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
            { $match: { 'contact.deleted': false, 'users.deleted': false } },
            { $group: { _id: groupFields, Emailcount: { $sum: 1 }, id: { $first: "$_id" } } },
            { $sort: { "_id.year": -1, "_id.month": 1, "_id.day": -1 } },
            { $group: { _id: "$_id.week", emails: { $push: "$$ROOT" }, totalEmails: { $sum: "$Emailcount" } } },
            {
                $project: {
                    _id: 0,
                    startDate: { $dateToString: { format: "%Y-%m-%d", date: startDate } },
                    endDate: { $dateToString: { format: "%Y-%m-%d", date: endDate } },
                    totalEmails: 1,
                    Emails2: {
                        $map: {
                            input: "$emails",
                            as: "email",
                            in: {
                                _id: "$$email.id",
                                date: {
                                    $dateToString: { date: { $dateFromParts: { year: { $ifNull: ["$$email._id.year", "$_id.year"] }, month: { $ifNull: ["$$email._id.month", 1] }, day: { $ifNull: ["$$email._id.day", 1] } } } },
                                },
                                Emailcount: "$$email.Emailcount",
                            },
                        },
                    },
                },
            },
            { $unwind: "$Emails2" },
            {
                $group: {
                    _id: { startDate: "$startDate", endDate: "$endDate", _id: "$Emails2._id" },
                    date: { $first: "$Emails2.date" },
                    Emailcount: { $first: "$Emails2.Emailcount" },
                },
            },
            {
                $project: {
                    _id: 0,
                    startDate: "$_id.startDate",
                    endDate: "$_id.endDate",
                    Emails: {
                        _id: "$_id._id",
                        date: "$date",
                        Emailcount: "$Emailcount",
                    },
                },
            },
            { $group: { _id: null, startDate: { $first: "$startDate" }, endDate: { $first: "$endDate" }, totalEmails: { $sum: "$Emails.Emailcount" }, Emails: { $push: "$Emails" } } },
            { $unwind: "$Emails" }, // Unwind the "Emails" array to work on each element separately
            { $sort: { "Emails.date": 1 } }, // Sort the Emails array by the "date" field in ascending order
            { $group: { _id: "$_id", startDate: { $first: "$startDate" }, endDate: { $first: "$endDate" }, totalEmails: { $first: "$totalEmails" }, Emails: { $push: "$Emails" }, }, },
            { $project: { _id: 0, startDate: 1, endDate: 1, totalEmails: 1, Emails: 1, }, },
        ]);


        let outboundcall = await PhoneCall.aggregate([
            { $match: matchFilter },
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
            { $match: { 'contact.deleted': false, 'users.deleted': false } },
            { $group: { _id: groupFields, Callcount: { $sum: 1 }, id: { $first: "$_id" } } },
            { $sort: { "_id.year": -1, "_id.month": 1, "_id.day": -1 } },
            { $group: { _id: "$_id.week", calls: { $push: "$$ROOT" }, totalCall: { $sum: "$Callcount" } } },
            {
                $project: {
                    _id: 0,
                    startDate: { $dateToString: { format: "%Y-%m-%d", date: startDate } },
                    endDate: { $dateToString: { format: "%Y-%m-%d", date: endDate } },
                    totalCall: 1,
                    result: {
                        $map: {
                            input: "$calls",
                            as: "call",
                            in: {
                                _id: "$$call.id",
                                date: {
                                    $dateToString: { date: { $dateFromParts: { year: { $ifNull: ["$$call._id.year", "$_id.year"] }, month: { $ifNull: ["$$call._id.month", 1] }, day: { $ifNull: ["$$call._id.day", 1] } } } },
                                },
                                Callcount: "$$call.Callcount",
                            },
                        },
                    },
                },
            },
            { $unwind: "$result" },
            {
                $group: {
                    _id: { startDate: "$startDate", endDate: "$endDate", _id: "$result._id" },
                    date: { $first: "$result.date" },
                    Callcount: { $first: "$result.Callcount" },
                },
            },
            {
                $project: {
                    _id: 0,
                    startDate: "$_id.startDate",
                    endDate: "$_id.endDate",
                    Calls: {
                        _id: "$_id._id",
                        date: "$date",
                        Callcount: "$Callcount",
                    },
                },
            },
            { $group: { _id: null, startDate: { $first: "$startDate" }, endDate: { $first: "$endDate" }, totalCall: { $sum: "$Calls.Callcount" }, Calls: { $push: "$Calls" } } },
            { $unwind: "$Calls" }, // Unwind the "Calls" array to work on each element separately
            { $sort: { "Calls.date": 1 } }, // Sort the Calls array by the "date" field in ascending order
            { $group: { _id: "$_id", startDate: { $first: "$startDate" }, endDate: { $first: "$endDate" }, totalCall: { $first: "$totalCall" }, Calls: { $push: "$Calls" }, }, },
            { $project: { _id: 0, startDate: 1, endDate: 1, totalCall: 1, Calls: 1, }, },
        ]);

        let TextSent = await TextMsg.aggregate([
            { $match: matchFilter },
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
            { $match: { 'contact.deleted': false, 'users.deleted': false } },
            { $group: { _id: groupFields, TextSentCount: { $sum: 1 }, id: { $first: "$_id" } } },
            { $sort: { "_id.year": -1, "_id.month": 1, "_id.day": -1 } },
            { $group: { _id: "$_id.week", textMsgs: { $push: "$$ROOT" }, totalTextSent: { $sum: "$TextSentCount" } } },
            {
                $project: {
                    _id: 0,
                    startDate: { $dateToString: { format: "%Y-%m-%d", date: startDate } },
                    endDate: { $dateToString: { format: "%Y-%m-%d", date: endDate } },
                    totalTextSent: 1,
                    result: {
                        $map: {
                            input: "$textMsgs",
                            as: "msg",
                            in: {
                                _id: "$$msg.id",
                                date: {
                                    $dateToString: { date: { $dateFromParts: { year: { $ifNull: ["$$msg._id.year", "$_id.year"] }, month: { $ifNull: ["$$msg._id.month", 1] }, day: { $ifNull: ["$$msg._id.day", 1] } } } },
                                },
                                TextSentCount: "$$msg.TextSentCount",
                            },
                        },
                    },
                },
            },
            { $unwind: "$result" },
            {
                $group: {
                    _id: { startDate: "$startDate", endDate: "$endDate", _id: "$result._id" },
                    date: { $first: "$result.date" },
                    TextSentCount: { $first: "$result.TextSentCount" },
                },
            },
            {
                $project: {
                    _id: 0,
                    startDate: "$_id.startDate",
                    endDate: "$_id.endDate",
                    TextMsges: {
                        _id: "$_id._id",
                        date: "$date",
                        TextSentCount: "$TextSentCount",
                    },
                },
            },
            { $group: { _id: null, startDate: { $first: "$startDate" }, endDate: { $first: "$endDate" }, totalTextSent: { $sum: "$TextMsges.TextSentCount" }, TextMsges: { $push: "$TextMsges" } } },
            { $unwind: "$TextMsges" }, // Unwind the "TextMsges" array to work on each element separately
            { $sort: { "TextMsges.date": 1 } }, // Sort the TextMsges array by the "date" field in ascending order
            { $group: { _id: "$_id", startDate: { $first: "$startDate" }, endDate: { $first: "$endDate" }, totalTextSent: { $first: "$totalTextSent" }, TextMsges: { $push: "$TextMsges" }, }, },
            { $project: { _id: 0, startDate: 1, endDate: 1, totalTextSent: 1, TextMsges: 1, }, },
        ]);

        if (EmailDetails.length <= 0 && outboundcall.length <= 0 && TextSent.length <= 0) {
            res.status(400).json({ totalEmails: 0, totalCall: 0, totalTextSent: 0 });
        } else {
            res.status(200).json({ EmailDetails, outboundcall });
            // res.status(200).json({ EmailDetails, outboundcall, TextSent });
        }

    } catch (err) {
        console.error('Failed :', err);
        res.status(400).json({ err, error: 'Failed ' });
    }
}


module.exports = { index, data }

