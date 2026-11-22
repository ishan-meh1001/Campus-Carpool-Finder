const Ride = require('../models/Ride');
const User = require('../models/User');

// @desc    Post a new carpool ride
// @route   POST /api/rides
// @access  Private
const createRide = async (req, res, next) => {
  try {
    const {
      origin,
      destination,
      departureDate,
      departureTime,
      totalSeats,
      pricePerSeat,
      notes,
      vehicle,
    } = req.body;

    if (!origin || !destination || !departureDate || !departureTime || !totalSeats) {
      return res.status(400).json({
        success: false,
        message: 'Please provide origin, destination, departure date, time, and seat count.',
      });
    }

    const seatsNum = Number(totalSeats);
    if (isNaN(seatsNum) || seatsNum < 1 || seatsNum > 7) {
      return res.status(400).json({
        success: false,
        message: 'Total seats must be a number between 1 and 7.',
      });
    }

    // Retrieve user's saved vehicle details if not provided in the request
    const user = await User.findById(req.user.id);
    const vehicleInfo = {
      make: vehicle?.make || user.vehicleDetails?.make || 'Unknown',
      model: vehicle?.model || user.vehicleDetails?.model || 'Car',
      licensePlate: vehicle?.licensePlate || user.vehicleDetails?.licensePlate || 'N/A',
      color: vehicle?.color || user.vehicleDetails?.color || 'N/A',
    };

    const ride = await Ride.create({
      driver: req.user.id,
      origin: origin.trim(),
      destination: destination.trim(),
      departureDate: new Date(departureDate),
      departureTime: departureTime.trim(),
      totalSeats: seatsNum,
      availableSeats: seatsNum,
      pricePerSeat: Number(pricePerSeat) || 0,
      notes: notes ? notes.trim() : '',
      vehicle: vehicleInfo,
      status: 'active',
      confirmedPassengers: [],
    });

    res.status(201).json({
      success: true,
      message: 'Ride posted successfully.',
      ride,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search and filter rides
// @route   GET /api/rides
// @access  Public (or Authenticated)
const getRides = async (req, res, next) => {
  try {
    const { origin, destination, date, seats } = req.query;

    const query = {
      status: 'active',
      availableSeats: { $gt: 0 },
    };

    // Filter by Origin (case-insensitive substring)
    if (origin && origin.trim()) {
      query.origin = { $regex: origin.trim(), $options: 'i' };
    }

    // Filter by Destination (case-insensitive substring)
    if (destination && destination.trim()) {
      query.destination = { $regex: destination.trim(), $options: 'i' };
    }

    // Filter by Date (same calendar day)
    if (date) {
      const searchDate = new Date(date);
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
      query.departureDate = { $gte: startOfDay, $lte: endOfDay };
    }

    // Filter by minimum available seats
    if (seats && Number(seats) > 0) {
      query.availableSeats = { $gte: Number(seats) };
    }

    const rides = await Ride.find(query)
      .populate('driver', 'name email phone ratingAverage ratingCount vehicleDetails')
      .sort({ departureDate: 1, departureTime: 1 });

    res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ride details by ID
// @route   GET /api/rides/:id
// @access  Public (or Authenticated)
const getRideById = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('driver', 'name email phone ratingAverage ratingCount vehicleDetails')
      .populate('confirmedPassengers', 'name email phone ratingAverage');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    res.status(200).json({
      success: true,
      ride,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rides posted by the logged-in driver
// @route   GET /api/rides/user/my-rides
// @access  Private
const getMyOfferedRides = async (req, res, next) => {
  try {
    const rides = await Ride.find({ driver: req.user.id })
      .populate('confirmedPassengers', 'name email phone ratingAverage')
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

// @desc    Mark a ride as completed
// @route   PUT /api/rides/:id/complete
// @access  Private (Driver only)
const completeRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    // Verify driver ownership or admin role
    if (ride.driver.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the driver can mark this ride as completed.',
      });
    }

    ride.status = 'completed';
    await ride.save();

    // Notify all confirmed passengers that the ride has finished and they can rate
    const Notification = require('../models/Notification');
    for (const passengerId of ride.confirmedPassengers) {
      await Notification.create({
        recipient: passengerId,
        sender: req.user.id,
        type: 'REQUEST_ACCEPTED',
        message: `Your ride from ${ride.origin} to ${ride.destination} is marked completed! You can now rate your driver.`,
        ride: ride._id,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ride marked as completed. Co-travellers can now exchange ratings.',
      ride,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a posted ride
// @route   PUT /api/rides/:id/cancel
// @access  Private (Driver only)
const cancelRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    // Verify driver ownership
    if (ride.driver.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this ride.',
      });
    }

    ride.status = 'cancelled';
    await ride.save();

    res.status(200).json({
      success: true,
      message: 'Ride cancelled successfully.',
      ride,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRide,
  getRides,
  getRideById,
  getMyOfferedRides,
  completeRide,
  cancelRide,
};
