const Asset = require('../models/Asset');
const User = require('../models/User');
const sendEmail = require('../utils/emailUtils');

// Create a new asset
exports.createAsset = async (req, res) => {
  const { tagID, serialNumber, name, procurementDate, lifecycleStatus, assignedTo } = req.body;
  try {
    let asset = new Asset({
      tagID,
      serialNumber,
      name,
      procurementDate,
      lifecycleStatus,
      assignedTo
    });

    await asset.save();

    // Send asset assignment email
    if (assignedTo) {
      const user = await User.findById(assignedTo);
      if (user) {
        const subject = 'New Asset Assigned';
        const text = `Hello ${user.name},\n\nA new asset (${name}, Serial Number: ${serialNumber}) has been assigned to you.\n\nBest regards,\nAsset Tracking Team`;

        try {
          await sendEmail(user.email, subject, text);
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          await Asset.findByIdAndDelete(asset.id);
          return res.status(500).json({ msg: 'Error sending email. Please try again.' });
        }
      }
    }

    res.json(asset);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all assets
exports.getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find().populate('assignedTo', 'name email');
    res.json(assets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get asset by ID
exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id).populate('assignedTo', 'name email');
    if (!asset) {
      return res.status(404).json({ msg: 'Asset not found' });
    }
    res.json(asset);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Asset not found' });
    }
    res.status(500).send('Server error');
  }
};

// Update asset details
exports.updateAsset = async (req, res) => {
  const { tagID, serialNumber, name, procurementDate, lifecycleStatus, assignedTo } = req.body;

  try {
    let asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ msg: 'Asset not found' });
    }

    asset.tagID = tagID || asset.tagID;
    asset.serialNumber = serialNumber || asset.serialNumber;
    asset.name = name || asset.name;
    asset.procurementDate = procurementDate || asset.procurementDate;
    asset.lifecycleStatus = lifecycleStatus || asset.lifecycleStatus;
    asset.assignedTo = assignedTo || asset.assignedTo;

    await asset.save();

    // Send asset assignment email
    if (assignedTo) {
      const user = await User.findById(assignedTo);
      if (user) {
        const subject = 'Asset Assignment Updated';
        const text = `Hello ${user.name},\n\nThe asset (${name}, Serial Number: ${serialNumber}) has been assigned to you.\n\nBest regards,\nAsset Tracking Team`;

        try {
          await sendEmail(user.email, subject, text);
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          return res.status(500).json({ msg: 'Error sending email. Please try again.' });
        }
      }
    }

    res.json(asset);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete asset
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ msg: 'Asset not found' });
    }

    await asset.remove();
    res.json({ msg: 'Asset removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Asset not found' });
    }
    res.status(500).send('Server error');
  }
};
