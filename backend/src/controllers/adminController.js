const User = require('../models/User');
const Ride = require('../models/Ride');
const RideRequest = require('../models/RideRequest');
const Rating = require('../models/Rating');

// @desc    Get dashboard metrics & statistics for administrators
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRides = await Ride.countDocuments();
    const activeRides = await Ride.countDocuments({ status: 'active' });
    const totalRequests = await RideRequest.countDocuments();
    const acceptedRequests = await RideRequest.countDocuments({ status: 'accepted' });
    const totalRatings = await Rating.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalRides,
        activeRides,
        totalRequests,
        acceptedRequests,
        totalRatings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search & filter
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { collegeId: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user account and associated rides/requests
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot delete their own account.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Cleanup user's rides and requests
    await Ride.deleteMany({ driver: req.params.id });
    await RideRequest.deleteMany({
      $or: [{ rider: req.params.id }, { driver: req.params.id }],
    });
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and all associated data deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rides for moderation
// @route   GET /api/admin/rides
// @access  Private (Admin only)
const getAllRides = async (req, res, next) => {
  try {
    const rides = await Ride.find()
      .populate('driver', 'name email phone collegeId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an inappropriate ride
// @route   DELETE /api/admin/rides/:id
// @access  Private (Admin only)
const deleteRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    await RideRequest.deleteMany({ ride: req.params.id });
    await ride.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Ride removed by moderator.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  deleteUser,
  getAllRides,
  deleteRide,
};
