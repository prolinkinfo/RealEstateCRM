const mongoose = require('mongoose');

const Quotes = new mongoose.Schema({
    title: String,
    description: String,
    approvalIssues: String,
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
    validUntil: String,
    quoteNumber: String,
    lineItems: String,
    total: String,
    subtotal: String,
    discount: String,
    tax: String,
    shipping: String,
    shippingTax: String,
    grandTotal: String,
    currency: String,
    quoteStage: String,
    paymentTerms: String,
    terms: String,
    approvalStatus: String,
    invoiceStatus: String,
    opportunity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Opportunities",
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contacts",
    },

    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
    createdDate: {
        type: Date,
    },
})

module.exports = mongoose.model('Quotes', Quotes, 'Quotes');