const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    origin: {
      type: String,
      required: [true, 'Please provide an origin / pickup location'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Please provide a destination / drop location'],
      trim: true,
    },
    departureDate: {
      type: Date,
      required: [true, 'Please provide a departure date'],
    },
    departureTime: {
      type: String,
      required: [true, 'Please provide a departure time (e.g. 08:30 AM)'],
      trim: true,
    },
    totalSeats: {
      type: Number,
      required: [true, 'Please specify total seats offered'],
      min: [1, 'Must offer at least 1 seat'],
      max: [7, 'Cannot offer more than 7 seats in a standard car'],
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [0, 'Available seats cannot be negative'],
    },
    pricePerSeat: {
      type: Number,
      required: [true, 'Please specify cost-sharing amount per seat'],
      min: [0, 'Cost per seat cannot be negative'],
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Notes cannot exceed 300 characters'],
    },
    vehicle: {
      make: { type: String, default: '' },
      model: { type: String, default: '' },
      licensePlate: { type: String, default: '' },
      color: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
      index: true,
    },
    confirmedPassengers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound text index for search on origin and destination
rideSchema.index({ origin: 'text', destination: 'text' });
// Index for filtering active upcoming rides by date
rideSchema.index({ departureDate: 1, status: 1 });

module.exports = mongoose.model('Ride', rideSchema);
