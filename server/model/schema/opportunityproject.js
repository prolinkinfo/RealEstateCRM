const mongoose = require('mongoose')
const OpportunityProject = new mongoose.Schema({
    name : {type : String , required : true},
    requirement : {type: String , required : true},
    createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false,
    }
})
module.exports = mongoose.model("OpportunityProjects", OpportunityProject,"OpportunityProjects")