const express = require('express');
const router = express.Router();
const Admin = require('../Module/Admin'); // Import Admin model

// Admin registration (One-time)
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Create new admin
        const newAdmin = new Admin({ email, password });

        // Save admin to the database
        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
