const express = require('express');
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Get all users
router.get('/', authMiddleware, getAllUsers);

// Get user by ID
router.get('/:id', authMiddleware, getUserById);

// Create a new user (Admin only)
router.post('/', authMiddleware, createUser);

// Update user details
router.put('/:id', authMiddleware, updateUser);

// Delete user
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
