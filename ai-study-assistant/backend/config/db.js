const mongoose = require('mongoose');

async function connectDB() {
  const mongoUri = (process.env.MONGODB_URI || '').trim();

  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing in environment variables.');
  }

  await mongoose.connect(mongoUri);
  console.log('[DB] MongoDB connected');
}

module.exports = connectDB;
