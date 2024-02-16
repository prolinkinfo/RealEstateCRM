const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    require: {
        type: Boolean,
    },
    min: {
        type: Boolean,
    },
    max: {
        type: Boolean,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
    },
    message: {
        type: String
    },
    match: {
        type: Boolean,
    },
    formikType: {
        type: String
    }
});

const validationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    validations: [documentSchema],
    createdDate: {
        type: Date
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Validation', validationSchema, 'Validation');