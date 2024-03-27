const mongoose = require('mongoose');

const fetchSchemaFields = async () => {
    const CustomFieldModel = mongoose.model('CustomField');
    return await CustomFieldModel.find({ moduleName: "Leads" });
};

const leadSchema = new mongoose.Schema({
    // // Lead Information:
    // leadName: String,
    // leadEmail: String,
    // leadPhoneNumber: String,
    // leadAddress: String,
    // // Lead Source and Details:
    // leadSource: String,
    // leadStatus: String,
    // leadSourceDetails: String,
    // leadCampaign: String,
    // leadSourceChannel: String,
    // leadSourceMedium: String,
    // leadSourceCampaign: String,
    // leadSourceReferral: String,
    // // Lead Assignment and Ownership:
    // leadAssignedAgent: String,
    // leadOwner: String,
    // // Lead Dates and Follow - up:
    // leadCreationDate: Date,
    // leadConversionDate: Date,
    // leadFollowUpDate: Date,
    // leadFollowUpStatus: String,
    // // Lead Interaction and Communication:
    // // leadInteractionHistory: [{ leadHistory }],
    // leadNotes: String,
    // leadCommunicationPreferences: String,
    // // Lead Scoring and Nurturing:
    // leadScore: Number,
    // leadNurturingWorkflow: String,
    // leadEngagementLevel: String,
    // leadConversionRate: Number,
    // leadNurturingStage: String,
    // leadNextAction: String,
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

const initializeLeadSchema = async () => {
    const schemaFieldsData = await fetchSchemaFields();
    schemaFieldsData[0]?.fields?.forEach((item) => {
        leadSchema.add({ [item.name]: item?.backendType });
    });
};

const Lead = mongoose.model('Leads', leadSchema, 'Leads');
module.exports = { Lead, initializeLeadSchema };
