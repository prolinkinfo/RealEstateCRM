const mongoose = require('mongoose');

const phoneCall = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    recipient: { type: String },
    callDuration: { type: String },
    callNotes: { type: String },
    phoneNumber: { type: String },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contacts',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('PhoneCall', phoneCall);