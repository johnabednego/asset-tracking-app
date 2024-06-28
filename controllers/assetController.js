const Asset = require('../models/Asset');
const User = require('../models/User');
const sendEmail = require('../utils/emailUtils');

// Function to notify all admins
const notifyAdmins = async (subject, text) => {
  try {
    const admins = await User.find({ role: 'admin' });
    const emailPromises = admins.map(admin => sendEmail(admin.email, subject, text));
    await Promise.all(emailPromises);
  } catch (error) {
    console.error('Error notifying admins:', error);
  }
};

// Create a new asset
exports.createAsset = async (req, res) => {
  const { tagID, serialNumber, name, procurementDate, status, condition, addedBy } = req.body;
  try {
    let asset = new Asset({
      tagID,
      serialNumber,
      name,
      procurementDate,
      status,
      condition,
      addedBy
    });

    await asset.save();

    // Notify admins
    const user = await User.findById(addedBy);
    const subject = 'New Asset Added';
    const text = `Hello Admin,\n\nA new asset (${name}, Serial Number: ${serialNumber}) has been added by ${user.name}.\n\nBest regards,\nAsset Tracking Team`;
    await notifyAdmins(subject, text);

    res.json(asset);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all assets
exports.getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find().populate('addedBy', 'name email').populate('lastEditedBy', 'name email');
    res.json(assets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get asset by ID
exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id).populate('addedBy', 'name email').populate('lastEditedBy', 'name email');
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
  const { tagID, serialNumber, name, procurementDate, status, condition, lastEditedBy } = req.body;

  try {
    let asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ msg: 'Asset not found' });
    }

    asset.tagID = tagID || asset.tagID;
    asset.serialNumber = serialNumber || asset.serialNumber;
    asset.name = name || asset.name;
    asset.procurementDate = procurementDate || asset.procurementDate;
    asset.status = status || asset.status;
    asset.condition = condition || asset.condition;
    asset.lastEditedBy = lastEditedBy || asset.lastEditedBy;

    await asset.save();

    // Notify admins
    const user = await User.findById(lastEditedBy);
    const subject = 'Asset Updated';
    const text = `Hello Admin,\n\nThe asset (${name}, Serial Number: ${serialNumber}) has been updated by ${user.name}.\n\nBest regards,\nAsset Tracking Team`;
    await notifyAdmins(subject, text);

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

    const user = await User.findById(req.user.id); // Assuming req.user contains the current user's ID

    await asset.remove();

    // Notify admins
    const subject = 'Asset Deleted';
    const text = `Hello Admin,\n\nThe asset (${asset.name}, Serial Number: ${asset.serialNumber}) has been deleted by ${user.name}.\n\nBest regards,\nAsset Tracking Team`;
    await notifyAdmins(subject, text);

    res.json({ msg: 'Asset removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Asset not found' });
    }
    res.status(500).send('Server error');
  }
};
