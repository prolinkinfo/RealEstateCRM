const mongoose = require('mongoose');

const accessSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    create: {
        type: Boolean,
        default: false,
    },
    update: {
        type: Boolean,
        default: false,
    },
    delete: {
        type: Boolean,
        default: false,
    },
    view: {
        type: Boolean,
        default: false,
    }
});

const roleAccess = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true
    },
    access: [accessSchema],
    modifyDate: {
        type: Date,
        default: Date.now,
    },
    createdDate: {
        type: Date,
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('roleAccess', roleAccess)