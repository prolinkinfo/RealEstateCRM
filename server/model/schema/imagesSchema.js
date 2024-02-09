const mongoose = require("mongoose");

const imagesSchema = new mongoose.Schema({
    authImg: {
        type: String,
    },
    logoSmImg: {
        type: String,
    },
    logoLgImg: {
        type: String
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
    isActive: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('Images', imagesSchema, 'Images');