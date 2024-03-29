const mongoose = require('mongoose');

const meetingHistory = new mongoose.Schema({
    agenda: { type: String, required: true },
    attendes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
    }],
    attendesLead: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
    }],
    location: String,
    related: String,
    dateTime: String,
    notes: String,
    // meetingReminders: { type: String, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
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

module.exports = mongoose.model('Meetings', meetingHistory, 'Meetings');
