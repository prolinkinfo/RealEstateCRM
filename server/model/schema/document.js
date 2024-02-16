const mongoose = require('mongoose');

// Define the schema for individual files
const fileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    linkContact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
    },
    linkLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
    },  
    path: {
        type: String,
        required: true,
    },
    img: String,
    createOn: {
        type: Date,
        default: Date.now,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
});

// Define the schema for the main document
const documentSchema = new mongoose.Schema({
    folderName: {
        type: String,
        required: true,
    },
    file: [fileSchema],
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

// Create the model for the main document


module.exports = mongoose.model('Document', documentSchema, 'Document');
