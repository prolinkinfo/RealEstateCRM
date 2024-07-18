const mongoose = require("mongoose");

const moduleActiveDeactiveSchema = new mongoose.Schema({
  moduleName: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('ModuleActiveDeactive', moduleActiveDeactiveSchema, 'ModuleActiveDeactive');
