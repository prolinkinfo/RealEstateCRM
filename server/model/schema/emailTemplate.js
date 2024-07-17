const mongoose = require('mongoose');

const EmailTemp = new mongoose.Schema({
    templateName: String,
    description: String,
    design: { type: Object },
    html: String,
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdDate: {
        type: Date,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model('EmailTemps', EmailTemp, 'EmailTemps');