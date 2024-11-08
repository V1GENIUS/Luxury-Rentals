const Admin = require('../Module/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });
};


exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.error('Admin not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      console.error('Password mismatch');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate the JWT token
    const token = generateToken(admin._id);
    console.log('Token generated successfully:', token);  // Log token generation for debugging

    // Send back the token in response
    res.json({
      id: admin._id,
      email: admin.email,
      token: token,
    });
  } catch (error) {
    console.error('Error during admin login:', error);  
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the admin
    const admin = await Admin.create({ email, password: hashedPassword });

    if (admin) {
      res.status(201).json({
        id: admin._id,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
