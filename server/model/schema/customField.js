const mongoose = require("mongoose");

const validationSchema = new mongoose.Schema({
    require: {
        type: Boolean,
    },
    max: {
        type: Boolean,
    },
    min: {
        type: Boolean,
    },
    value: {
        type: Number,
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

const fieldsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    label: {
        type: String,
    },
    type: {
        type: String,
        default: 'text'
    },
    delete: {
        type: Boolean,
        default: false
    },
    validation: [validationSchema],
});

const customFieldSchema = new mongoose.Schema({
    moduleName: {
        type: String,
        required: true
    },
    fields: [fieldsSchema]
});

module.exports = mongoose.model("customField", customFieldSchema);