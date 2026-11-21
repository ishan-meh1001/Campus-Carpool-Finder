const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.info(`[Database Info] Please check your MONGO_URI in .env file (ensure MongoDB is running locally or provide a MongoDB Atlas connection string).`);
    // In production we would exit, but for dev we let server run so developers can configure .env without process termination loop
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
