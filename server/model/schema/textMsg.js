const mongoose = require('mongoose');

const TextMsg = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    to: { type: String },
    message: { type: String },
    createFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contacts',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('textMsg', TextMsg);