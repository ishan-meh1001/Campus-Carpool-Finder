const Rating = require('../models/Rating');
const Ride = require('../models/Ride');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Submit a rating and review for a co-traveller
// @route   POST /api/ratings
// @access  Private
const createRating = async (req, res, next) => {
  try {
    const { rideId, toUserId, rating, review } = req.body;

    if (!rideId || !toUserId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Ride ID, recipient user ID, and rating value (1-5) are required.',
      });
    }

    const ratingVal = Number(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5.',
      });
    }

    if (req.user.id === toUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot rate yourself.',
      });
    }

    // Verify ride
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    // Check if rater was an eligible participant
    const isDriver = ride.driver.toString() === req.user.id;
    const isPassenger = ride.confirmedPassengers.some(
      (p) => p.toString() === req.user.id
    );

    if (!isDriver && !isPassenger) {
      return res.status(403).json({
        success: false,
        message: 'You were not a confirmed participant in this ride.',
      });
    }

    // Check if recipient was an eligible participant
    const recipientIsDriver = ride.driver.toString() === toUserId;
    const recipientIsPassenger = ride.confirmedPassengers.some(
      (p) => p.toString() === toUserId
    );

    if (!recipientIsDriver && !recipientIsPassenger) {
      return res.status(400).json({
        success: false,
        message: 'The user you are rating was not a confirmed participant in this ride.',
      });
    }

    // Check duplicate rating
    const existingRating = await Rating.findOne({
      ride: rideId,
      fromUser: req.user.id,
      toUser: toUserId,
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a rating for this user on this journey.',
      });
    }

    // Create rating
    const newRating = await Rating.create({
      ride: rideId,
      fromUser: req.user.id,
      toUser: toUserId,
      rating: ratingVal,
      review: review ? review.trim() : '',
    });

    // Recalculate recipient's average rating
    const recipientRatings = await Rating.find({ toUser: toUserId });
    const count = recipientRatings.length;
    const avg =
      recipientRatings.reduce((acc, curr) => acc + curr.rating, 0) / count;

    await User.findByIdAndUpdate(toUserId, {
      ratingAverage: Math.round(avg * 10) / 10,
      ratingCount: count,
    });

    // Create notification for recipient
    await Notification.create({
      recipient: toUserId,
      sender: req.user.id,
      type: 'NEW_RATING',
      message: `${req.user.name} gave you a ${ratingVal}-star rating for your recent carpool.`,
      ride: rideId,
    });

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully.',
      rating: newRating,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews received by a user
// @route   GET /api/ratings/user/:id
// @access  Public
const getUserRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ toUser: req.params.id })
      .populate('fromUser', 'name')
      .populate('ride', 'origin destination departureDate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ratings.length,
      ratings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRating,
  getUserRatings,
};
