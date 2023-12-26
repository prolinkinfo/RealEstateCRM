const mongoose = require('mongoose');


const leadSchema = new mongoose.Schema({
    // Lead Information:
    leadName: String,
    leadEmail: String,
    leadPhoneNumber: String,
    leadAddress: String,
    // Lead Source and Details:
    leadSource: String,
    leadStatus: String,
    leadSourceDetails: String,
    leadCampaign: String,
    leadSourceChannel: String,
    leadSourceMedium: String,
    leadSourceCampaign: String,
    leadSourceReferral: String,
    // Lead Assignment and Ownership:
    leadAssignedAgent: String,
    leadOwner: String,
    // Lead Dates and Follow - up:
    leadCreationDate: Date,
    leadConversionDate: Date,
    leadFollowUpDate: Date,
    leadFollowUpStatus: String,
    // Lead Interaction and Communication:
    // leadInteractionHistory: [{ leadHistory }],
    leadNotes: String,
    leadCommunicationPreferences: String,
    // Lead Scoring and Nurturing:
    leadScore: Number,
    leadNurturingWorkflow: String,
    leadEngagementLevel: String,
    leadConversionRate: Number,
    leadNurturingStage: String,
    leadNextAction: String,
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
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
