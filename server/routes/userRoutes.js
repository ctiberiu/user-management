const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// Create a new user
router.post('/', createUser);

// Get all users
router.get('/', getUsers);

// Get a single user by ID
router.get('/:id', getUserById);

// Update a user by ID
router.put('/:id', verifyToken, updateUser);

// Delete a user by ID
router.delete('/:id', deleteUser);

module.exports = router;
