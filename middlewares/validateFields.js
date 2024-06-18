const { validationResult, check } = require('express-validator');

exports.validateUserRegistration = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateUserLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateAssetCreation = [
  check('tagID', 'Tag ID is required').not().isEmpty(),
  check('serialNumber', 'Serial Number is required').not().isEmpty(),
  check('name', 'Name is required').not().isEmpty(),
  check('procurementDate', 'Procurement Date is required').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
