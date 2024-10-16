const express = require('express');
const { signup, login, getUser ,getAllUsers, logout } = require('../Controller/userController');
// Create a router
const router = express.Router();
const auth = require('../middleware/auth');

// Define the signup route
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Route to get user data
router.get('/getUser', auth, getUser);
router.get('/getAllUsers', auth, getAllUsers);



module.exports = router;
