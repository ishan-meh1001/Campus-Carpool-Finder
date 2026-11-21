const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_carpool';

  try {
    // Attempt connecting to the configured MONGO_URI with a 2-second timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`[Database Error] Failed to connect to MongoDB in production: ${error.message}`);
      process.exit(1);
    }

    console.warn(`[Database Warning] Could not connect to '${uri}'.`);
    console.log(`[Database] Initializing embedded in-memory MongoDB for local development...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[Database] Embedded In-Memory MongoDB Connected: ${conn.connection.host}`);
      console.info(`[Database Info] Ready for instant testing! To persist data across server restarts, provide a MongoDB Atlas connection string in backend/.env (MONGO_URI=mongodb+srv://...)`);
    } catch (memError) {
      console.error(`[Database Critical Error] Failed to start fallback in-memory MongoDB: ${memError.message}`);
    }
  }
};

module.exports = connectDB;
