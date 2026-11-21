const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const dataDir = path.resolve(__dirname, '../.data/mongodb');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Remove any lingering lock file from a previous unclean exit
const lockFile = path.join(dataDir, 'mongod.lock');
if (fs.existsSync(lockFile)) {
  try {
    fs.unlinkSync(lockFile);
  } catch (e) {}
}

const seedInitialUsers = async () => {
  try {
    const User = require('../src/models/User');

    // Check if demo user exists
    const demoExists = await User.findOne({ email: 'demo@college.edu' });
    if (!demoExists) {
      console.log('[MongoDB Server] Seeding Demo Student account...');
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
      await demoUser.save();
      console.log('  - Student ready: demo@college.edu / password123');
    }

    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@college.edu' });
    if (!adminExists) {
      console.log('[MongoDB Server] Seeding Campus Administrator account...');
      const adminUser = new User({
        name: 'Campus Administrator',
        email: 'admin@college.edu',
        password: 'adminpassword123',
        phone: '9876543299',
        collegeId: 'FACULTY-01',
        role: 'admin',
        isVerified: true,
      });
      await adminUser.save();
      console.log('  - Admin ready: admin@college.edu / adminpassword123');
    }
  } catch (err) {
    console.error('[MongoDB Server Seed Error]:', err.message);
  }
};

(async () => {
  try {
    console.log('[MongoDB Server] Initializing dedicated MongoDB Server on port 27018...');
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27018,
        dbPath: dataDir,
        storageEngine: 'wiredTiger',
      },
    });

    const uri = mongod.getUri();
    console.log(`[MongoDB Server] 🟢 Dedicated MongoDB Server running at: ${uri}`);
    console.log(`[MongoDB Server] 📁 Persistent storage directory: ${dataDir}`);

    // Connect briefly to seed demo accounts
    await mongoose.connect('mongodb://127.0.0.1:27018/campus_carpool');
    await seedInitialUsers();
    await mongoose.disconnect();
    console.log('[MongoDB Server] ✅ Database ready for connections.');

    // Handle clean shutdown
    const handleShutdown = async () => {
      console.log('\n[MongoDB Server] Shutting down MongoDB...');
      await mongod.stop();
      process.exit(0);
    };

    process.on('SIGINT', handleShutdown);
    process.on('SIGTERM', handleShutdown);
  } catch (error) {
    console.error('[MongoDB Server Error]:', error);
    process.exit(1);
  }
})();
