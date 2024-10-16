const mongoose = require('mongoose');
require('dotenv').config();  // To use .env variables

// MongoDB URI from .env file
const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017/server';  // Fallback URI

// MongoDB Connection Function
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB Connected Successfully');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

module.exports = mongoose;
