const mongoose = require('mongoose');

async function connection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
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
  connectToAtlas();
});

module.exports = connection;
