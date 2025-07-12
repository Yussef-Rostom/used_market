const mongoose = require('mongoose');

const connection = () => {
  mongoose.connect('mongodb://127.0.0.1:27017/used-market')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
};

module.exports = connection;
