const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
      index: true,
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    seatsRequested: {
      type: Number,
      required: true,
      min: [1, 'Must request at least 1 seat'],
      max: [7, 'Cannot request more seats than available vehicle limit'],
      default: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
      index: true,
    },
    message: {
      type: String,
      trim: true,
      default: '',
      maxlength: [200, 'Message cannot exceed 200 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active/pending requests by the same rider for the same ride
rideRequestSchema.index({ ride: 1, rider: 1 }, { unique: true });

module.exports = mongoose.model('RideRequest', rideRequestSchema);
