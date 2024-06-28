const Employee = require('../models/Employee');
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

// Add Employee
exports.addEmployee = async (req, res) => {
  const { name, role, isVerified, status, addedBy } = req.body;
  try {
    let employee = new Employee({
      name,
      role,
      isVerified,
      status,
      addedBy
    });

    await employee.save();

    const user = await User.findById(addedBy);
    const subject = 'New Employee Added';
    const text = `Hello Admin,\n\nA new employee (${name}, Role: ${role}) has been added by ${user.name}.\n\nBest regards,\nAsset Tracking Team`;
    await notifyAdmins(subject, text);

    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Edit Employee
exports.editEmployee = async (req, res) => {
  const { name, role, isVerified, status, lastEditedBy } = req.body;
  try {
    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    employee.name = name || employee.name;
    employee.role = role || employee.role;
    employee.isVerified = isVerified !== undefined ? isVerified : employee.isVerified;
    employee.status = status || employee.status;
    employee.lastEditedBy = lastEditedBy;

    await employee.save();

    const user = await User.findById(lastEditedBy);
    const subject = 'Employee Edited';
    const text = `Hello Admin,\n\nThe employee (${employee.name}, Role: ${employee.role}) has been edited by ${user.name}.\n\nBest regards,\nAsset Tracking Team`;
    await notifyAdmins(subject, text);

    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    await employee.remove();
    res.json({ msg: 'Employee removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
