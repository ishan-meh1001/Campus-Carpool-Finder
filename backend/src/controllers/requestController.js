const RideRequest = require('../models/RideRequest');
const Ride = require('../models/Ride');
const Notification = require('../models/Notification');

// @desc    Request to join an active carpool ride
// @route   POST /api/requests
// @access  Private (Rider)
const createRequest = async (req, res, next) => {
  try {
    const { rideId, seatsRequested, message } = req.body;

    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: 'Ride ID is required.',
      });
    }

    const seats = Number(seatsRequested) || 1;
    if (seats < 1) {
      return res.status(400).json({
        success: false,
        message: 'Must request at least 1 seat.',
      });
    }

    // Fetch ride
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'The requested ride does not exist.',
      });
    }

    // Prevent driver from joining their own ride
    if (ride.driver.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request to join your own ride.',
      });
    }

    // Check if ride is active and has enough available seats
    if (ride.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This ride is no longer active.',
      });
    }

    if (ride.availableSeats < seats) {
      return res.status(400).json({
        success: false,
        message: `Only ${ride.availableSeats} seat(s) available. You requested ${seats}.`,
      });
    }

    // Check for existing request by this user
    const existingRequest = await RideRequest.findOne({
      ride: rideId,
      rider: req.user.id,
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: `You already have a '${existingRequest.status}' request for this ride.`,
      });
    }

    const request = await RideRequest.create({
      ride: rideId,
      rider: req.user.id,
      driver: ride.driver,
      seatsRequested: seats,
      message: message ? message.trim() : '',
      status: 'pending',
    });

    // Notify driver about incoming request
    await Notification.create({
      recipient: ride.driver,
      sender: req.user.id,
      type: 'REQUEST_RECEIVED',
      message: `${req.user.name} requested ${seats} seat(s) for your ride from ${ride.origin} to ${ride.destination}.`,
      ride: rideId,
    });

    res.status(201).json({
      success: true,
      message: 'Ride request submitted successfully. Awaiting driver approval.',
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all incoming requests for rides offered by the logged-in driver
// @route   GET /api/requests/driver
// @access  Private (Driver)
const getDriverRequests = async (req, res, next) => {
  try {
    const requests = await RideRequest.find({ driver: req.user.id })
      .populate('rider', 'name email phone ratingAverage ratingCount')
      .populate('ride', 'origin destination departureDate departureTime availableSeats status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests made by the logged-in rider
// @route   GET /api/requests/rider
// @access  Private (Rider)
const getRiderRequests = async (req, res, next) => {
  try {
    const requests = await RideRequest.find({ rider: req.user.id })
      .populate('driver', 'name email phone ratingAverage vehicleDetails')
      .populate('ride', 'origin destination departureDate departureTime pricePerSeat status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to a ride request (Accept or Reject)
// @route   PUT /api/requests/:id/status
// @access  Private (Driver only)
const respondToRequest = async (req, res, next) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'accepted' or 'rejected'.",
      });
    }

    const request = await RideRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Ride request not found.',
      });
    }

    // Verify driver ownership
    if (request.driver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this ride request.',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${request.status}.`,
      });
    }

    if (status === 'accepted') {
      // ATOMIC UPDATE TO PREVENT RACE CONDITIONS / OVERBOOKING
      // We conditionally find and update the ride only if availableSeats >= seatsRequested
      const updatedRide = await Ride.findOneAndUpdate(
        {
          _id: request.ride,
          availableSeats: { $gte: request.seatsRequested },
          status: 'active',
        },
        {
          $inc: { availableSeats: -request.seatsRequested },
          $addToSet: { confirmedPassengers: request.rider },
        },
        { new: true }
      );

      if (!updatedRide) {
        return res.status(400).json({
          success: false,
          message: 'Cannot accept request: Not enough seats remaining or ride has ended.',
        });
      }

      request.status = 'accepted';
      await request.save();

      // Notify rider of acceptance
      await Notification.create({
        recipient: request.rider,
        sender: req.user.id,
        type: 'REQUEST_ACCEPTED',
        message: `Great news! Your request for the ride to ${updatedRide.destination} was accepted by ${req.user.name}.`,
        ride: request.ride,
      });

      return res.status(200).json({
        success: true,
        message: 'Request accepted. Seat count updated automatically.',
        request,
        updatedRide,
      });
    } else {
      // Rejection
      request.status = 'rejected';
      await request.save();

      // Notify rider of rejection
      await Notification.create({
        recipient: request.rider,
        sender: req.user.id,
        type: 'REQUEST_REJECTED',
        message: `Your ride request was declined by the driver.`,
        ride: request.ride,
      });

      return res.status(200).json({
        success: true,
        message: 'Request rejected.',
        request,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a pending request by the rider
// @route   PUT /api/requests/:id/cancel
// @access  Private (Rider only)
const cancelRequest = async (req, res, next) => {
  try {
    const request = await RideRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found.',
      });
    }

    if (request.rider.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this request.',
      });
    }

    if (request.status === 'accepted') {
      // If was already accepted, restore the seat count atomically
      await Ride.findByIdAndUpdate(request.ride, {
        $inc: { availableSeats: request.seatsRequested },
        $pull: { confirmedPassengers: request.rider },
      });
    }

    request.status = 'cancelled';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Ride request cancelled successfully.',
      request,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getDriverRequests,
  getRiderRequests,
  respondToRequest,
  cancelRequest,
};
