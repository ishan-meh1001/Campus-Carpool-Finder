const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

let memoryServer = null;

// Seed initial demo and admin users with proper bcrypt hashing
const seedInitialUsers = async () => {
  try {
    const User = require('../models/User');

    // Check if demo user exists
    const demoExists = await User.findOne({ email: 'demo@college.edu' });
    if (!demoExists) {
      console.log('[Database Seed] Seeding Demo Student account...');
      const demoUser = new User({
        name: 'Demo Student',
        email: 'demo@college.edu',
        password: 'password123',
        phone: '9876543210',
        collegeId: '22BCSE101',
        role: 'student',
        isVerified: true,
        vehicleDetails: {
          make: 'Maruti Suzuki',
          model: 'Swift',
          licensePlate: 'DL 01 AB 1234',
          color: 'White',
          capacity: 3,
        },
      });
      await demoUser.save(); // Triggers pre('save') to hash password
      console.log('  - Student ready: demo@college.edu / password123');
    }

    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@college.edu' });
    if (!adminExists) {
      console.log('[Database Seed] Seeding Campus Administrator account...');
      const adminUser = new User({
        name: 'Campus Administrator',
        email: 'admin@college.edu',
        password: 'adminpassword123',
        phone: '9876543299',
        collegeId: 'FACULTY-01',
        role: 'admin',
        isVerified: true,
      });
      await adminUser.save(); // Triggers pre('save') to hash password
      console.log('  - Admin ready: admin@college.edu / adminpassword123');
    }
  } catch (seedErr) {
    console.error('[Database Seed Error]:', seedErr.message);
  }
};

const connectDB = async () => {
  // If user provides a remote MongoDB Atlas connection string in .env
  if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('127.0.0.1') && !process.env.MONGO_URI.includes('localhost')) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
      await seedInitialUsers();
      return;
    } catch (err) {
      console.error(`[Database Error] Could not connect to MongoDB Atlas: ${err.message}`);
    }
  }

  // Persistent Local Embedded MongoDB Server
  console.log('[Database] Starting persistent local MongoDB database server...');
  try {
    const dataDir = path.resolve(__dirname, '../../.data/mongodb');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbPath: dataDir,
        storageEngine: 'wiredTiger',
      },
    });

    const uri = memoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`[Database] Persistent Local MongoDB Server Running: ${conn.connection.host}`);
    console.log(`[Database] Storage Directory: ${dataDir}`);

    await seedInitialUsers();
  } catch (error) {
    console.error(`[Database Critical Error] Failed to initialize persistent MongoDB: ${error.message}`);
  }
};

module.exports = connectDB;
