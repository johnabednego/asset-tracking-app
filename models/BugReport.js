const mongoose = require('mongoose');

const BugReportSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fixed: {
    type: Boolean,
    default: false
  },
  reportDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('BugReport', BugReportSchema);
