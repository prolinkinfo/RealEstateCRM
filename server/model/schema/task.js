const mongoose = require('mongoose');

const Task = new mongoose.Schema({
    title: String,
    category: String,
    description: String,
    notes: String,
    assignmentTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact",
    },
    assignmentToLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
    },
    reminder: String,
    start: String,
    end: String,
    backgroundColor: String,
    borderColor: String,
    textColor: String,
    display: String,
    url: String,
    allDay:String,
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "todo"
    },
    createdDate: {
        type: Date,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model('Task', Task, 'Task');