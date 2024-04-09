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
    createByLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
    },
    createByContact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

module.exports = mongoose.model('Calls', phoneCall, 'Calls');