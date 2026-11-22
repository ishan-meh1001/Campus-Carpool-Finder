const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
      index: true,
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating score between 1 and 5 is required'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
    },
    review: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Review comment cannot exceed 300 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate ratings for the same participant on the same journey
ratingSchema.index({ ride: 1, fromUser: 1, toUser: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
