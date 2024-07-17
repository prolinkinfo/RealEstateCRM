const mongoose = require('mongoose');

const fetchSchemaFields = async () => {
    const CustomFieldModel = mongoose.model('CustomField');
    return await CustomFieldModel.find({ moduleName: "Contacts" });
};

const contactSchema = new mongoose.Schema({
    // 1. Basic Information
    // firstName: String,
    // lastName: String,
    // title: String,
    // email: String,
    // phoneNumber: Number,
    // mobileNumber: Number,
    // physicalAddress: String,
    // mailingAddress: String,
    // preferredContactMethod: String,
    // // 2.Lead Source Information
    // leadSource: String,
    // referralSource: String,
    // campaignSource: String,
    // // 3. Status and Classifications
    // leadStatus: String,
    // leadRating: Number,
    // leadConversionProbability: String,
    // // 4. Property of Interest
    interestProperty: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Properties',
    }],
    quotes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Quotes',
    }],
    // // 5. History:
    // notesandComments: String,
    // // 6. Tags or Categories
    // tagsOrLabelsForcategorizingcontacts: String,
    // // 7. Important Dates:
    // birthday: Date,
    // anniversary: Date,
    // keyMilestones: String,
    // // 8. Additional Personal Information
    // dob: String,
    // gender: String,
    // occupation: String,
    // interestsOrHobbies: String,
    // // 9. Preferred  Communication Preferences:
    // communicationFrequency: String,
    // preferences: String,
    // // 10. Social Media Profiles:
    // linkedInProfile: String,
    // facebookProfile: String,
    // twitterHandle: String,
    // otherProfiles: String,
    // // 11. Lead Assignment and Team Collaboration:
    // agentOrTeamMember: String,
    // internalNotesOrComments: String,
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
    createdDate: {
        type: Date,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
});

const initializeContactSchema = async () => {
    const schemaFieldsData = await fetchSchemaFields();
    schemaFieldsData[0]?.fields?.forEach((item) => {
        contactSchema.add({ [item.name]: item?.backendType });
    });
};

const Contact = mongoose.model('Contacts', contactSchema, 'Contacts');
module.exports = { Contact, initializeContactSchema };
