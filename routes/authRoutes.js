const express = require('express');
const { register, login, verifyEmail } = require('../controllers/authController');
const { validateUserRegistration, validateUserLogin } = require('../middlewares/validateFields');
const router = express.Router();

router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.get('/verify-email', verifyEmail);

module.exports = router;
