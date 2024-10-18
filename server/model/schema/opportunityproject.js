const mongoose = require("mongoose");
const OpportunityProject = new mongoose.Schema({
  name: { type: String, required: true },
  requirement: { type: String, required: true },
  category: String,
  createdDate: {
    type: Date,
    default: Date.now,
  },
  property: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Properties",
    },
  ],
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact",
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
  },
  modifiedDate: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model(
  "OpportunityProjects",
  OpportunityProject,
  "OpportunityProjects"
);
