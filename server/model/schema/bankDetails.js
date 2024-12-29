const mongoose = require('mongoose');

const bankDetail = new mongoose.Schema({
    accountName: String,
    accountNumber: Number,
    swiftCode: Number,
    bank: String,
    branch: String,
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('BankDetails', bankDetail, 'BankDetails');
