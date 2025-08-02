const mongoose = require('mongoose');

const connection = () => {
  mongoose.connect('mongodb+srv://yussefrostom:hMGtHgTUpJkgxsWF@used-market.do9ez83.mongodb.net/?retryWrites=true&w=majority&appName=used-market')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
};

module.exports = connection;
