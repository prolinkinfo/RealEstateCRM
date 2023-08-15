const mongoose = require('mongoose');

const emailHistory = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    recipient: { type: String },
    cc: { type: String },
    bcc: { type: String },
    subject: { type: String },
    message: { type: String },
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

module.exports = mongoose.model('EmailHistory', emailHistory);
