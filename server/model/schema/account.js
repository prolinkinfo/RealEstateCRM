const mongoose = require('mongoose');

const Account = new mongoose.Schema({
    name: String,
    officePhone: Number,
    alternatePhone: Number,
    website: String,
    fax: String,
    ownership: String,
    emailAddress: String,
    nonPrimaryEmail: String,
    billingStreet: String,
    billingStreet2: String,
    billingStreet3: String,
    billingStreet4: String,
    billingPostalcode: String,
    billingCity: String,
    billingState: String,
    billingCountry: String,
    shippingStreet: String,
    shippingStreet2: String,
    shippingStreet3: String,
    shippingStreet4: String,
    shippingPostalcode: String,
    shippingCity: String,
    shippingState: String,
    shippingCountry: String,
    description: String,
    type: String,
    industry: String,
    annualRevenue: String,
    rating: String,
    SICCode: String,
    assignUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    emailOptOut: {
        type: Boolean,
        default: false
    },
    invalidEmail: {
        type: Boolean,
        default: false
    },
    memberOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accounts',
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model('Accounts', Account, 'Accounts');