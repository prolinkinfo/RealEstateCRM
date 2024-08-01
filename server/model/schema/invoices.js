const mongoose = require('mongoose');

const Invoices = new mongoose.Schema({
    title: String,
    description: String,
    quoteNumber: String,
    quoteDate: Date,
    dueDate: Date,
    invoiceDate: Date,
    status: String,
    billingStreet: String,
    billingCity: String,
    billingState: String,
    billingPostalCode: String,
    billingCountry: String,
    shippingStreet: String,
    shippingCity: String,
    shippingState: String,
    shippingPostalCode: String,
    shippingCountry: String,
    invoiceNumber: String,
    lineItems: String,
    total: String,
    subtotal: String,
    discount: String,
    tax: String,
    ptax: String,
    shipping: String,
    shippingTax: String,
    grandTotal: String,
    currency: String,
    quoteStage: String,
    paymentTerms: String,
    description: String,
    approvalStatus: String,
    invoiceStatus: String,
    discountType: String,
    items: [],
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accounts",
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contacts",
    },
    quotesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quotes",
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isCheck: {
        type: Boolean,
        default: false,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    invoiceConvertDate: {
        type: Date,
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
    createdDate: {
        type: Date,
    },
})

module.exports = mongoose.model('Invoices', Invoices, 'Invoices');

