const mongoose = require('mongoose');

async function connectToAtlas() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Connection error:', err.message);
    setTimeout(connectToAtlas, 5000);
  }
}

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from Atlas');
  setTimeout(connectToAtlas, 5000);
});

module.exports = connectToAtlas;