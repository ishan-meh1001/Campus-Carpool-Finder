const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Do not return password by default in queries
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    collegeId: {
      type: String,
      trim: true,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: true, // Auto-verified for frictionless MVP development
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    vehicleDetails: {
      make: { type: String, default: '' },
      model: { type: String, default: '' },
      licensePlate: { type: String, default: '' },
      color: { type: String, default: '' },
      capacity: { type: Number, default: 3, min: 1, max: 7 },
    },
    ratingAverage: {
      type: Number,
      default: 5.0,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating cannot exceed 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
