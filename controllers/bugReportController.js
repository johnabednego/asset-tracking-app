const BugReport = require('../models/BugReport');
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

// Add Bug Report
exports.addBugReport = async (req, res) => {
  const { description, reportedBy, reportDate, fixed } = req.body;
  try {
    let bugReport = new BugReport({
      description,
      reportedBy,
      reportDate,
      fixed
    });

    await bugReport.save();

    const user = await User.findById(reportedBy);
    const subject = 'New Bug Reported';
    const text = `Hello Admin,\n\nA new bug has been reported by ${user.name}.\n\nDescription: ${description}\n\nBest regards,\nAsset Tracking Team`;
    await notifyAdmins(subject, text);

    res.json(bugReport);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
