const mongoose = require('mongoose');

const Opportunity = new mongoose.Schema({
    opportunityName: String,
    accountName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accounts',
    },
    assignUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    type: String,
    leadSource: String,
    currency: String,
    opportunityAmount: String,
    amount: String,
    expectedCloseDate: Date,
    nextStep: String,
    salesStage: String,
    probability: String,
    description: String,
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

module.exports = mongoose.model('Opportunities', Opportunity, 'Opportunities');