const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const token = req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // Attach the decoded token payload (which contains the user ID) to the request object

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = auth;
