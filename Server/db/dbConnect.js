const mongoose = require('mongoose');
require('dotenv').config();  

const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017/server';

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
