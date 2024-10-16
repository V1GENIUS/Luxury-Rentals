const express = require('express');
const router = express.Router();
const { adminLogin, registerAdmin } = require('../Controller/adminController');

// Admin login
router.post('/login', adminLogin);

// Optional admin registration route
router.post('/register', registerAdmin);

module.exports = router;
