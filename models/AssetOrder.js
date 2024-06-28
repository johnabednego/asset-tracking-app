const mongoose = require('mongoose');

const AssetOrderSchema = new mongoose.Schema({
  assetName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('AssetOrder', AssetOrderSchema);
