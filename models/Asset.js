const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  tagID: {
    type: String,
    required: true,
    unique: true
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  procurementDate: {
    type: Date,
    required: true
  },
  lifecycleStatus: {
    type: String,
    enum: ['active', 'maintenance', 'retired'],
    default: 'active'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
}, { timestamps: true });

module.exports = mongoose.model('Asset', AssetSchema);
