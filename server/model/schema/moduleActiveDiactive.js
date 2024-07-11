const mongoose = require("mongoose");

const moduleActiveDiactiveSchema = new mongoose.Schema({
  moduleName: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('ModuleActiveDiactive', moduleActiveDiactiveSchema, 'ModuleActiveDiactive');
