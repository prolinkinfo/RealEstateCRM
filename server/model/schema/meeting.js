const mongoose = require('mongoose');

const meetingHistory = new mongoose.Schema({
    agenda: { type: String, required: true },
    attendes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'contacts',
        required: true
    }],
    attendesLead: [{
        type: mongoose.Schema.ObjectId,
        ref: 'leads',
        required: true
    }],
    location: String,
    related: String,
    dateTime: String,
    notes: String,
    // meetingReminders: { type: String, required: true },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        require: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('meetingHistory', meetingHistory);
