const Quotes = require("../../model/schema/quotes.js");
const mongoose = require("mongoose");
const User = require('../../model/schema/user')
const Invoices = require("../../model/schema/invoices.js");



async function getNextAutoIncrementValue() {
    const num = await Quotes.countDocuments({});
    return num + 1;
}
async function getNextAutoIncrementInvoiceValue() {
    const num = await Invoices.countDocuments({});
    return num + 1;
}
const index = async (req, res) => {
    query = req.query;
    query.deleted = false;
    const user = await User.findById(req.user.userId)
    if (user?.role !== "superAdmin") {
        delete query.createBy
        query.$or = [{ createBy: new mongoose.Types.ObjectId(req.user.userId) }, { assignUser: new mongoose.Types.ObjectId(req.user.userId) }];
    }

    try {
        let result = await Quotes.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "Contacts",
                    localField: "contact",
                    foreignField: "_id",
                    as: "contactData",
                },
            },
            {
                $lookup: {
                    from: "Accounts",
                    localField: "account",
                    foreignField: "_id",
                    as: "accountData",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "createBy",
                    foreignField: "_id",
                    as: "users",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "modifiedBy",
                    foreignField: "_id",
                    as: "modifiedByUser",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedToData",
                },
            },
            { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$contactData", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$accountData", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$modifiedByUser', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$assignedToData", preserveNullAndEmptyArrays: true } },
            { $match: { "users.deleted": false } },
            {
                $addFields: {
                    assignUserName: {
                        $cond: {
                            if: '$assignUsers',
                            then: { $concat: ['$assignUsers.firstName', ' ', '$assignUsers.lastName'] },
                            else: { $concat: [''] }
                        }
                    },
                    createdByName: { $concat: ['$users.firstName', ' ', '$users.lastName'] },
                    modifiedUserName: { $concat: ['$modifiedByUser.firstName', ' ', '$modifiedByUser.lastName'] },
                    contactName: { $concat: ['$contactData.firstName', ' ', '$contactData.lastName'] },
                    accountName: '$accountData.name'
                }
            },
            { $project: { users: 0, contactData: 0, accountData: 0, modifiedByUser: 0, assignedToData: 0 } },
        ]);
        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

const add = async (req, res) => {
    try {
        const nextAutoIncrementValue = await getNextAutoIncrementValue();
        const result = new Quotes({ ...req.body, quoteNumber: nextAutoIncrementValue });
        await result.save();
        res.status(200).json(result);
    } catch (err) {
        console.error("Failed to create Quotes:", err);
        res.status(400).json({ error: "Failed to create Quotes : ", err });
    }
};

const edit = async (req, res) => {
    try {

        let result = await Quotes.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(result);
    } catch (err) {
        console.error("Failed to create Quotes:", err);
        res.status(400).json({ error: "Failed to create Quotes : ", err });
    }
};
const addMany = async (req, res) => {
    try {
        const data = req.body.map((item) => ({
            ...item,
            account: item.account ? item.account : null,
            contact: item.contact ? item.contact : null,
        }))
        const inserted = await Quotes.insertMany(data);

        res.status(200).json(inserted);
    } catch (err) {
        console.error('Failed to create Quotes :', err);
        res.status(400).json({ error: 'Failed to create Quotes' });
    }
};

const view = async (req, res) => {
    try {
        let response = await Quotes.findOne({ _id: req.params.id });
        if (!response) return res.status(404).json({ message: "no Data Found." });
        let result = await Quotes.aggregate([
            { $match: { _id: response._id } },
            {
                $lookup: {
                    from: "Opportunities",
                    localField: "oppotunity",
                    foreignField: "_id",
                    as: "oppotunityData",
                },
            },
            {
                $lookup: {
                    from: "Contacts",
                    localField: "contact",
                    foreignField: "_id",
                    as: "contactData",
                },
            },
            {
                $lookup: {
                    from: "Accounts",
                    localField: "account",
                    foreignField: "_id",
                    as: "accountData",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "createBy",
                    foreignField: "_id",
                    as: "users",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "modifiedBy",
                    foreignField: "_id",
                    as: "modifiedByUser",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedToData",
                },
            },
            { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$contactData", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$accountData", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$modifiedByUser', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$assignedToData", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$oppotunityData", preserveNullAndEmptyArrays: true } },
            { $match: { "users.deleted": false } },
            {
                $addFields: {
                    assignUserName: {
                        $cond: {
                            if: '$assignedToData',
                            then: { $concat: ['$assignedToData.firstName', ' ', '$assignedToData.lastName'] },
                            else: { $concat: [''] }
                        }
                    },
                    oppotunityName: '$oppotunityData.opportunityName',
                    createdByName: { $concat: ['$users.firstName', ' ', '$users.lastName'] },
                    modifiedUserName: { $concat: ['$modifiedByUser.firstName', ' ', '$modifiedByUser.lastName'] },
                    contactName: { $concat: ['$contactData.firstName', ' ', '$contactData.lastName'] },
                    accountName: '$accountData.name'
                }
            },
            { $project: { users: 0, contactData: 0, accountData: 0, modifiedByUser: 0, oppotunityData: 0, assignedToData: 0 } },
        ]);
        let invoiceDetails = await Invoices.aggregate([
            { $match: { quotesId: response._id, deleted: false } },
            {
                $lookup: {
                    from: "Contacts",
                    localField: "contact",
                    foreignField: "_id",
                    as: "contactData",
                },
            },
            {
                $lookup: {
                    from: "Accounts",
                    localField: "account",
                    foreignField: "_id",
                    as: "accountData",
                },
            },
            { $unwind: { path: "$contactData", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$accountData", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    contactName: { $concat: ['$contactData.firstName', ' ', '$contactData.lastName'] },
                    accountName: '$accountData.name'
                }
            },
            { $project: { contactData: 0, accountData: 0 } },

        ]);
        res.status(200).json({ result: result[0], invoiceDetails });
    } catch (err) {
        console.log("Error:", err);
        res.status(400).json({ Error: err });
    }
};

const convertToInvoice = async (req, res) => {
    try {
        let quotesData = await Quotes.findOne({ _id: req.body._id });
        if (!quotesData) {
            return res.status(404).json({ message: "Quotes not found" })
        }
        const nextAutoIncrementValue = await getNextAutoIncrementInvoiceValue();

        const invoiceDetails = {
            invoiceNumber: nextAutoIncrementValue,
            quotesId: quotesData?._id,
            title: quotesData?.title,
            quoteNumber: quotesData?.quoteNumber,
            quoteDate: quotesData?.createdDate,
            dueDate: quotesData?.dueDate,
            invoiceDate: new Date(),
            status: "Paid",
            assignedTo: quotesData?.assignedTo,
            description: quotesData?.description,
            account: quotesData?.account,
            contact: quotesData?.contact,
            billingStreet: quotesData?.billingStreet,
            shippingStreet: quotesData?.shippingStreet,
            billingCity: quotesData?.billingCity,
            shippingCity: quotesData?.shippingCity,
            billingState: quotesData?.billingState,
            shippingState: quotesData?.shippingState,
            billingPostalCode: quotesData?.billingPostalCode,
            shippingPostalCode: quotesData?.shippingPostalCode,
            billingCountry: quotesData?.billingCountry,
            shippingCountry: quotesData?.shippingCountry,
            isCheck: quotesData?.isCheck,
            currency: quotesData?.currency,
            total: quotesData?.total,
            discount: quotesData?.discount,
            subtotal: quotesData?.subtotal,
            shipping: quotesData?.shipping,
            shippingTax: quotesData?.shippingTax,
            ptax: quotesData?.ptax,
            tax: quotesData?.tax,
            grandTotal: quotesData?.grandTotal,
            discountType: quotesData?.discountType,
            items: quotesData?.items,
            invoiceConvertDate: new Date(),
            createBy: quotesData?.createBy,
            modifiedBy: quotesData?.modifiedBy
        }

        const invoiceData = new Invoices(invoiceDetails);
        await invoiceData.save();

        let result = await Quotes.findOneAndUpdate(
            { _id: req.body._id },
            { $set: { invoiceStatus: "Invoiced" } },
            { new: true }
        );

        res.status(200).json({ message: "Invoiced Convert successfully", result });
    } catch (err) {
        res.status(404).json({ message: "error", err });
    }
}

const deleteData = async (req, res) => {
    try {
        const result = await Quotes.findByIdAndUpdate(req.params.id, {
            deleted: true,
        });
        res.status(200).json({ message: "done", result });
    } catch (err) {
        res.status(404).json({ message: "error", err });
    }
};

const deleteMany = async (req, res) => {
    try {
        const result = await Quotes.updateMany(
            { _id: { $in: req.body } },
            { $set: { deleted: true } }
        );

        if (result?.matchedCount > 0 && result?.modifiedCount > 0) {
            return res
                .status(200)
                .json({ message: "Quotes Removed successfully", result });
        } else {
            return res
                .status(404)
                .json({ success: false, message: "Failed to remove Quotes" });
        }
    } catch (err) {
        return res.status(404).json({ success: false, message: "error", err });
    }
};

module.exports = { index, add, edit, addMany, view, deleteData, deleteMany, convertToInvoice };
