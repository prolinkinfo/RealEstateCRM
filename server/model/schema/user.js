const mongoose = require('mongoose');

// create login schema
const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: { type: String, default: 'user' },
    emailsent: { type: Number, default: 0 },
    textsent: { type: Number, default: 0 },
    outboundcall: { type: Number, default: 0 },
    phoneNumber: { type: Number },
    firstName: String,
    lastName: String,
    deleted: {
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model('User', user)
