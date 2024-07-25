const mongoose = require('mongoose');
const { Lead } = require('../../model/schema/lead')
const { Contact } = require('../../model/schema/contact')
const email = require('../../model/schema/email');
const User = require('../../model/schema/user')
const PhoneCall = require('../../model/schema/phoneCall');
const { Property } = require('../../model/schema/property')
const TextMsg = require('../../model/schema/textMsg');
const Task = require('../../model/schema/task')
const MeetingHistory = require('../../model/schema/meeting');
// const user = require('../../model/schema/user');
const customField = require('../../model/schema/customField');
const Account = require('../../model/schema/account');
const EmailTemp = require('../../model/schema/emailTemplate')
const Opprtunities = require('../../model/schema/opprtunity')
const Invoices = require("../../model/schema/invoices.js");
const Quotes = require("../../model/schema/quotes.js");
const ModuleActiveDeactive = require('../../model/schema/moduleActiveDeactive.js');

const index = async (req, res) => {
    const query = req.query
    query.deleted = false;
    let result = await User.find(query)
    res.send(result)
}

const lineChart = async (req, res) => {
    const query = req.query
    query.deleted = false;
    const senderQuery = query
    if (query.createdBy) {
        query.createdBy = new mongoose.Types.ObjectId(query.createdBy);
    }
    if (query.createdBy) {
        senderQuery.sender = new mongoose.Types.ObjectId(query.createdBy);
    }

    let lead = await Lead.find(query).populate({
        path: 'createBy',
        match: { deleted: false }
    }).exec()
    const leadData = lead.filter(item => item?.createBy !== null);

    let contact = await Contact.find(query).populate({
        path: 'createBy',
        match: { deleted: false }
    }).exec()
    const contactData = contact.filter(item => item?.createBy !== null);

    let property = await Property.find(query).populate({
        path: 'createBy',
        match: { deleted: false }
    }).exec()
    const propertyData = property.filter(item => item?.createBy !== null);

    let task = await Task.find(query).populate({
        path: 'createBy',
        match: { deleted: false }
    }).exec()
    const taskData = task.filter(item => item?.createBy !== null);

    let meetingHistory = await MeetingHistory.find(query).populate({
        path: 'createBy',
        match: { deleted: false }
    }).exec()
    const meetingHistoryData = meetingHistory.filter(item => item?.createdBy !== null);

    let emails = await email.find(senderQuery).populate({
        path: 'sender',
        match: { deleted: false }
    }).exec()
    const emailData = emails.filter(item => item?.sender !== null);

    let phoneCall = await PhoneCall.find(senderQuery).populate({
        path: 'sender',
        match: { deleted: false }
    }).exec()
    const phoneCallData = phoneCall.filter(item => item?.sender !== null);

    let account = await Account.find(senderQuery).populate({
        path: 'createBy',
        match: { deleted: false }
    }).exec()
    const AccountData = account.filter(item => item?.createBy !== null);

    let emailTemp = await EmailTemp.find(senderQuery).populate({
        path: 'createBy',
        match: { deleted: false }
    }).exec()
    const EmailTempData = emailTemp.filter(item => item?.createBy !== null);

    let opprtunities = await Opprtunities.find(senderQuery).populate({
        path: 'createBy',
        match: { deleted: false }
    }).exec()
    const OpprtunitiesData = opprtunities.filter(item => item?.createBy !== null);

    let invoices = await Invoices.find(senderQuery).populate({
        path: 'createBy',
        match: { deleted: false }
    }).exec()
    const InvoicesData = invoices.filter(item => item?.createBy !== null);

    let quotes = await Quotes.find(senderQuery).populate({
        path: 'createBy',
        match: { deleted: false }
    }).exec()
    const QuotesData = quotes.filter(item => item?.createBy !== null);


    const userDetails = await User.findOne({ _id: req.user.userId }).populate({
        path: 'roles'
    })
    const fields = await customField.find({ deleted: false })

    const mergedRoles = userDetails?.roles?.reduce((acc, current) => {
        current?.access?.forEach(permission => {
            const existingPermissionIndex = acc.findIndex(item => item.title === permission.title);
            if (existingPermissionIndex !== -1) {
                const updatedPermission = { ...acc[existingPermissionIndex] };
                Object.keys(permission).forEach(key => {
                    if (permission[key] === true) {
                        updatedPermission[key] = true;
                    }
                });
                acc[existingPermissionIndex] = updatedPermission;
            } else {
                acc.push(permission);
            }
        });
        return acc;
    }, []);

    let result = [
        { name: "Leads", length: leadData?.length, color: "red" },
        { name: "Contacts", length: contactData?.length, color: "blue" },
        { name: "Properties", length: propertyData?.length, color: "green" },
        { name: "Opportunities", length: OpprtunitiesData?.length, color: "linkedin" },
        { name: "Account", length: AccountData?.length, color: "teal" },
        { name: "Quotes", length: QuotesData?.length, color: "blackAlpha" },
        { name: "Invoices", length: InvoicesData?.length, color: "linkedin" },
        { name: "Tasks", length: taskData?.length, color: "pink" },
        { name: "Meetings", length: meetingHistoryData?.length, color: "purple" },
        { name: "Calls", length: phoneCallData?.length, color: "cyan" },
        { name: "Emails", length: emailData?.length, color: "yellow" },
        { name: "Email Template", length: EmailTempData?.length, color: "orange" },
    ]

    const colors = ["whiteAlpha", "blackAlpha", "gray", "red", "orange", "yellow", "green", "teal", "blue", "cyan", "purple", "pink", "linkedin", "facebook", "messenger", "whatsapp", "twitter", "telegram"];

    if (mergedRoles && mergedRoles.length > 0) {
        for (const item of mergedRoles) {
            if (item.title === "Leads" && item.view === false) {
                const data = result.filter((val) => val.name !== "Leads")
                result = data
            }
            if (item.title === "Contacts" && item.view === false) {
                const data = result.filter((val) => val.name !== "Contacts")
                result = data
            }
            if (item.title === "Properties" && item.view === false) {
                const data = result.filter((val) => val.name !== "Properties")
                result = data
            }
            if (item.title === "Opportunities" && item.view === false) {
                const data = result.filter((val) => val.name !== "Opportunities")
                result = data
            }
            if (item.title === "Account" && item.view === false) {
                const data = result.filter((val) => val.name !== "Account")
                result = data
            }
            if (item.title === "Quotes" && item.view === false) {
                const data = result.filter((val) => val.name !== "Quotes")
                result = data
            }
            if (item.title === "Invoices" && item.view === false) {
                const data = result.filter((val) => val.name !== "Invoices")
                result = data
            }
            if (item.title === "Tasks" && item.view === false) {
                const data = result.filter((val) => val.name !== "Tasks")
                result = data
            }
            if (item.title === "Meetings" && item.view === false) {
                const data = result.filter((val) => val.name !== "Meetings")
                result = data
            }
            if (item.title === "Calls" && item.view === false) {
                const data = result.filter((val) => val.name !== "Calls")
                result = data
            }
            if (item.title === "Emails" && item.view === false) {
                const data = result.filter((val) => val.name !== "Emails")
                result = data
            }
            if (item.title === "Email Template" && item.view === false) {
                const data = result.filter((val) => val.name !== "Email Template")
                result = data
            }

            if (item.view === true) {
                if (!result.find((i) => i.name === item.title)) {
                    const ExistingModel = mongoose.model(item.title);
                    const allData = await ExistingModel.find({ deleted: false });
                    const colorIndex = result.length % colors.length;
                    const color = colors[colorIndex];

                    const newObj = {
                        name: item.title,
                        length: allData.length,
                        color: color
                    };

                    result.push(newObj);
                }

            }
        }
    } else if (userDetails?.role === "superAdmin") {
        for (const item of fields) {
            if (!result.find((i) => i.name === item.moduleName)) {
                const ExistingModel = mongoose.model(item.moduleName);
                const allData = await ExistingModel.find({ deleted: false });
                const colorIndex = result.length % colors.length;
                const color = colors[colorIndex];

                const newObj = {
                    name: item.moduleName,
                    length: allData.length,
                    color: color
                };

                result.push(newObj);
            }
        }
    } else {
        result = [];
    }

    let moduleData = await ModuleActiveDeactive?.find({ isActive: true });
    const activeModules = moduleData?.map(item => item?.moduleName)
    let activeModulesReport = result?.filter(item => activeModules?.includes(item?.name))

    res.send(activeModulesReport)
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


        // let EmailDetails = await email.aggregate([
        //     { $match: matchFilter },
        //     {
        //         $lookup: {
        //             from: 'Contacts',
        //             localField: 'createBy',
        //             foreignField: '_id',
        //             as: 'contact'
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'Leads',
        //             localField: 'createByLead',
        //             foreignField: '_id',
        //             as: 'lead'
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'User',
        //             localField: 'sender',
        //             foreignField: '_id',
        //             as: 'users'
        //         }
        //     },
        //     { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
        //     { $unwind: '$contact' },
        //     { $unwind: '$lead' },
        //     { $match: { 'contact.deleted': false, 'users.deleted': false } },
        //     { $match: { 'lead.deleted': false, 'users.deleted': false } },
        //     { $group: { _id: groupFields, Emailcount: { $sum: 1 }, id: { $first: "$_id" } } },
        //     { $sort: { "_id.year": -1, "_id.month": 1, "_id.day": -1 } },
        //     { $group: { _id: "$_id.week", emails: { $push: "$$ROOT" }, totalEmails: { $sum: "$Emailcount" } } },
        //     {
        //         $project: {
        //             _id: 0,
        //             startDate: { $dateToString: { format: "%Y-%m-%d", date: startDate } },
        //             endDate: { $dateToString: { format: "%Y-%m-%d", date: endDate } },
        //             totalEmails: 1,
        //             Emails2: {
        //                 $map: {
        //                     input: "$emails",
        //                     as: "email",
        //                     in: {
        //                         _id: "$$email.id",
        //                         date: {
        //                             $dateToString: { date: { $dateFromParts: { year: { $ifNull: ["$$email._id.year", "$_id.year"] }, month: { $ifNull: ["$$email._id.month", 1] }, day: { $ifNull: ["$$email._id.day", 1] } } } },
        //                         },
        //                         Emailcount: "$$email.Emailcount",
        //                     },
        //                 },
        //             },
        //         },
        //     },
        //     { $unwind: "$Emails2" },
        //     {
        //         $group: {
        //             _id: { startDate: "$startDate", endDate: "$endDate", _id: "$Emails2._id" },
        //             date: { $first: "$Emails2.date" },
        //             Emailcount: { $first: "$Emails2.Emailcount" },
        //         },
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             startDate: "$_id.startDate",
        //             endDate: "$_id.endDate",
        //             Emails: {
        //                 _id: "$_id._id",
        //                 date: "$date",
        //                 Emailcount: "$Emailcount",
        //             },
        //         },
        //     },
        //     { $group: { _id: null, startDate: { $first: "$startDate" }, endDate: { $first: "$endDate" }, totalEmails: { $sum: "$Emails.Emailcount" }, Emails: { $push: "$Emails" } } },
        //     { $unwind: "$Emails" }, // Unwind the "Emails" array to work on each element separately
        //     { $sort: { "Emails.date": 1 } }, // Sort the Emails array by the "date" field in ascending order
        //     { $group: { _id: "$_id", startDate: { $first: "$startDate" }, endDate: { $first: "$endDate" }, totalEmails: { $first: "$totalEmails" }, Emails: { $push: "$Emails" }, }, },
        //     { $project: { _id: 0, startDate: 1, endDate: 1, totalEmails: 1, Emails: 1, }, },
        // ]);

        // let EmailDetails = await email.aggregate([
        //     { $match: matchFilter },
        //     { $lookup: { from: 'Contacts', localField: 'createBy', foreignField: '_id', as: 'contact' } },
        //     { $unwind: { path: '$contact', preserveNullAndEmptyArrays: true } },
        //     { $lookup: { from: 'Leads', localField: 'createByLead', foreignField: '_id', as: 'lead' } },
        //     { $unwind: { path: '$lead', preserveNullAndEmptyArrays: true } },
        //     { $lookup: { from: 'User', localField: 'sender', foreignField: '_id', as: 'users' } },
        //     { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
        //     {
        //         // $match: {
        //         //     'contact.deleted': false,
        //         //     'users.deleted': false,
        //         //     'lead.deleted': false
        //         // }
        //         $match: {
        //             'contact.deleted': { $ne: true },
        //             'users.deleted': { $ne: true },
        //             'lead.deleted': { $ne: true }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: groupFields,
        //             Emailcount: { $sum: 1 },
        //             id: { $first: '$_id' }
        //         }
        //         // {
        //         //     $group: {
        //         //         _id: {
        //         //             year: { $year: '$date' },
        //         //             month: { $month: '$date' },
        //         //             day: { $dayOfMonth: '$date' }
        //         //         },
        //         //         Emailcount: { $sum: 1 },
        //         //         id: { $first: '$_id' }
        //         //     }
        //     },
        //     {
        //         $sort: {
        //             '_id.year': -1,
        //             '_id.month': 1,
        //             '_id.day': -1
        //         }
        //     },
        //     // {
        //     //     $group: {
        //     //         _id: { week: { $week: '$date' } },
        //     //         emails: { $push: '$$ROOT' },
        //     //         totalEmails: { $sum: '$Emailcount' }
        //     //     }
        //     // },
        //     { $group: { _id: "$_id.week", calls: { $push: "$$ROOT" }, totalEmails: { $sum: "$Emailcount" } } },

        //     {
        //         $project: {
        //             _id: 0,
        //             startDate: { $dateToString: { format: '%Y-%m-%d', date: startDate } },
        //             endDate: { $dateToString: { format: '%Y-%m-%d', date: endDate } },
        //             totalEmails: 1,
        //             Emails: {
        //                 $map: {
        //                     input: '$emails',
        //                     as: 'email',
        //                     in: {
        //                         _id: '$$email.id',
        //                         date: {
        //                             $dateToString: {
        //                                 date: {
        //                                     $dateFromParts: {
        //                                         year: { $ifNull: ['$$email._id.year', '$_id.year'] },
        //                                         month: { $ifNull: ['$$email._id.month', 1] },
        //                                         day: { $ifNull: ['$$email._id.day', 1] }
        //                                     }
        //                                 }
        //                             }
        //                         },
        //                         Emailcount: '$$email.Emailcount'
        //                     }
        //                 }
        //             }
        //         }
        //     },
        //     { $unwind: '$Emails' },
        //     {
        //         $group: {
        //             _id: { startDate: '$startDate', endDate: '$endDate', _id: '$Emails._id' },
        //             date: { $first: '$Emails.date' },
        //             Emailcount: { $first: '$Emails.Emailcount' }
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             startDate: '$_id.startDate',
        //             endDate: '$_id.endDate',
        //             Emails: {
        //                 _id: '$_id._id',
        //                 date: '$date',
        //                 Emailcount: '$Emailcount'
        //             }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             startDate: { $first: '$startDate' },
        //             endDate: { $first: '$endDate' },
        //             totalEmails: { $sum: '$Emails.Emailcount' },
        //             Emails: { $push: '$Emails' }
        //         }
        //     },
        //     { $unwind: '$Emails' },
        //     { $sort: { 'Emails.date': 1 } },
        //     {
        //         $group: {
        //             _id: '$_id',
        //             startDate: { $first: '$startDate' },
        //             endDate: { $first: '$endDate' },
        //             totalEmails: { $first: '$totalEmails' },
        //             Emails: { $push: '$Emails' }
        //         }
        //     },
        //     { $project: { _id: 0, startDate: 1, endDate: 1, totalEmails: 1, Emails: 1 } }
        // ]);
        let Email = await email.aggregate([
            { $match: matchFilter },
            { $lookup: { from: 'Contacts', localField: 'createBy', foreignField: '_id', as: 'contact' } },
            { $unwind: { path: '$contact', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'Leads', localField: 'createByLead', foreignField: '_id', as: 'lead' } },
            { $unwind: { path: '$lead', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'User', localField: 'sender', foreignField: '_id', as: 'users' } },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    'contact.deleted': { $ne: true },
                    'users.deleted': { $ne: true },
                    'lead.deleted': { $ne: true }
                }
            },
            {
                $group: {
                    _id: groupFields,
                    Emailcount: { $sum: 1 },
                    id: { $first: '$_id' }
                }
            },
            {
                $sort: {
                    '_id.year': -1,
                    '_id.month': 1,
                    '_id.day': -1
                }
            },

            { $group: { _id: "$_id.week", emails: { $push: "$$ROOT" }, totalEmails: { $sum: "$Emailcount" } } },

            {
                $project: {
                    _id: 0,
                    startDate: { $dateToString: { format: '%Y-%m-%d', date: startDate } },
                    endDate: { $dateToString: { format: '%Y-%m-%d', date: endDate } },
                    totalEmails: 1,
                    Emails: {
                        $map: {
                            input: '$emails',
                            as: 'email',
                            in: {
                                _id: '$$email.id',
                                date: {
                                    $dateToString: { date: { $dateFromParts: { year: { $ifNull: ['$$email._id.year', '$_id.year'] }, month: { $ifNull: ['$$email._id.month', 1] }, day: { $ifNull: ['$$email._id.day', 1] } } } }
                                },
                                Emailcount: '$$email.Emailcount'
                            }
                        }
                    }
                }
            },
            { $unwind: '$Emails' },
            {
                $group: {
                    _id: { startDate: '$startDate', endDate: '$endDate', _id: '$Emails._id' },
                    date: { $first: '$Emails.date' },
                    Emailcount: { $first: '$Emails.Emailcount' }
                }
            },
            {
                $project: {
                    _id: 0,
                    startDate: '$_id.startDate',
                    endDate: '$_id.endDate',
                    Emails: {
                        _id: '$_id._id',
                        date: '$date',
                        Emailcount: '$Emailcount'
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    startDate: { $first: '$startDate' },
                    endDate: { $first: '$endDate' },
                    totalEmails: { $sum: '$Emails.Emailcount' },
                    Emails: { $push: '$Emails' }
                }
            },
            { $unwind: '$Emails' },
            { $sort: { 'Emails.date': 1 } },
            {
                $group: {
                    _id: '$_id',
                    startDate: { $first: '$startDate' },
                    endDate: { $first: '$endDate' },
                    totalEmails: { $first: '$totalEmails' },
                    Emails: { $push: '$Emails' }
                }
            },
            { $project: { _id: 0, startDate: 1, endDate: 1, totalEmails: 1, Emails: 1 } }
        ]);



        let Call = await PhoneCall.aggregate([
            { $match: matchFilter },
            { $lookup: { from: 'Contacts', localField: 'createBy', foreignField: '_id', as: 'contact' } },
            { $unwind: { path: '$contact', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'Leads', localField: 'createByLead', foreignField: '_id', as: 'lead' } },
            { $unwind: { path: '$lead', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'User', localField: 'sender', foreignField: '_id', as: 'users' } },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    'contact.deleted': { $ne: true },
                    'users.deleted': { $ne: true },
                    'lead.deleted': { $ne: true }
                }
            },
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
                    from: 'Contact',
                    localField: 'createFor',
                    foreignField: '_id',
                    as: 'contact'
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

        if (Email.length <= 0 && Call.length <= 0 && TextSent.length <= 0) {
            res.status(200).json({ totalEmails: 0, totalCall: 0, totalTextSent: 0 });
        } else {
            res.status(200).json({ Email, Call });
            // res.status(200).json({ EmailDetails, outboundcall, TextSent });
        }

    } catch (err) {
        console.error('Failed :', err);
        res.status(400).json({ err, error: 'Failed ' });
    }
}


module.exports = { index, lineChart, data }