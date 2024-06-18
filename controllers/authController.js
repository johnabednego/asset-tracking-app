const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/emailUtils');

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    user = new User({
      name,
      email,
      password,
      verificationToken
    });

    await user.save();

    // Send verification email
    const verificationUrl = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;
    const subject = 'Email Verification';
    const text = `Hello ${user.name},\n\nPlease verify your email by clicking the link: ${verificationUrl}\n\nBest regards,\nAsset Tracking Team`;

    try {
      await sendEmail(user.email, subject, text);
      res.json({ msg: 'Verification email sent. Please check your inbox.' });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      await User.findByIdAndDelete(user.id);
      res.status(500).json({ msg: 'Error sending verification email. Please try again.' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired verification token' });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ msg: 'Email verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (!user.verified) {
      return res.status(400).json({ msg: 'Please verify your email before logging in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
