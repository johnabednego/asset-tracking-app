const AssetOrder = require('../models/AssetOrder');
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

// Add Asset Order
exports.addAssetOrder = async (req, res) => {
  const { assetName, quantity, orderDate, addedBy } = req.body;
  try {
    let assetOrder = new AssetOrder({
      assetName,
      quantity,
      orderDate,
      addedBy
    });

    await assetOrder.save();

    const user = await User.findById(addedBy);
    const subject = 'New Asset Order';
    const text = `Hello Admin,\n\nA new asset order (${assetName}, Quantity: ${quantity}) has been placed by ${user.name}.\n\nBest regards,\nAsset Tracking Team`;
    await notifyAdmins(subject, text);

    res.json(assetOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
