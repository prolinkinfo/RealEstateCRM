const mongoose = require('mongoose');

const phoneCall = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: { type: String },
    callDuration: { type: String },
    callNotes: { type: String },
    phoneNumber: { type: String },
    startDate: { type: String, default: Date.now },
    endDate: { type: String },
    createByLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model('PhoneCall', phoneCall, 'PhoneCall');