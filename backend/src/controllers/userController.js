const User = require('../models/User');

// @desc    Get user public profile by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      'name email phone collegeId vehicleDetails ratingAverage ratingCount'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update personal profile information
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, collegeId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (collegeId !== undefined) user.collegeId = collegeId.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        collegeId: user.collegeId,
        role: user.role,
        vehicleDetails: user.vehicleDetails,
        ratingAverage: user.ratingAverage,
        ratingCount: user.ratingCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle details for driving/posting rides
// @route   PUT /api/users/vehicle
// @access  Private
const updateVehicle = async (req, res, next) => {
  try {
    const { make, model, licensePlate, color, capacity } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.vehicleDetails = {
      make: make ? make.trim() : user.vehicleDetails?.make || '',
      model: model ? model.trim() : user.vehicleDetails?.model || '',
      licensePlate: licensePlate ? licensePlate.trim().toUpperCase() : user.vehicleDetails?.licensePlate || '',
      color: color ? color.trim() : user.vehicleDetails?.color || '',
      capacity: capacity ? Number(capacity) : user.vehicleDetails?.capacity || 3,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle details saved successfully.',
      vehicleDetails: user.vehicleDetails,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserById,
  updateProfile,
  updateVehicle,
};
