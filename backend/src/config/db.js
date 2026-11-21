const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27018/campus_carpool';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}:${conn.connection.port || 27018}`);
  } catch (error) {
    console.error(`[Database Error] Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.info(`[Database Info] Ensure the dedicated MongoDB server is running (npm run mongodb) or provide your MongoDB Atlas URI in backend/.env.`);
  }
};

module.exports = connectDB;
