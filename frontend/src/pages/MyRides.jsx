import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rideService } from '../services/rideService';
import { requestService } from '../services/requestService';
import {
  Car,
  Users,
  Calendar,
  Clock,
  IndianRupee,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';

const MyRides = () => {
  const [activeTab, setActiveTab] = useState('driving'); // 'driving' or 'bookings'
  const [offeredRides, setOfferedRides] = useState([]);
  const [driverRequests, setDriverRequests] = useState([]);
  const [riderRequests, setRiderRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const [ridesRes, driverReqRes, riderReqRes] = await Promise.all([
        rideService.getMyOfferedRides(),
        requestService.getDriverRequests(),
        requestService.getRiderRequests(),
      ]);

      if (ridesRes.success) setOfferedRides(ridesRes.rides);
      if (driverReqRes.success) setDriverRequests(driverReqRes.requests);
      if (riderReqRes.success) setRiderRequests(riderReqRes.requests);
    } catch (err) {
      console.error('Error loading ride data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Driver accepts or rejects a request
  const handleRespondRequest = async (requestId, status) => {
    setActionMsg({ type: '', text: '' });
    try {
      const res = await requestService.respondToRequest(requestId, status);
      if (res.success) {
        setActionMsg({
          type: 'success',
          text: `Request successfully ${status}!`,
        });
        loadData(); // Reload to refresh seat counts and lists
      }
    } catch (err) {
      setActionMsg({
        type: 'error',
        text: err.response?.data?.message || `Failed to ${status} request.`,
      });
    }
  };

  // Driver cancels a ride
  const handleCancelRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to cancel this ride?')) return;
    try {
      const res = await rideService.cancelRide(rideId);
      if (res.success) {
        setActionMsg({ type: 'success', text: 'Ride cancelled successfully.' });
        loadData();
      }
    } catch (err) {
      setActionMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to cancel ride.',
      });
    }
  };

  // Rider cancels their own request
  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Cancel this ride request?')) return;
    try {
      const res = await requestService.cancelRequest(requestId);
      if (res.success) {
        setActionMsg({ type: 'success', text: 'Request cancelled.' });
        loadData();
      }
    } catch (err) {
      setActionMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to cancel request.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Carpool Hub</h1>
          <p className="text-sm text-gray-500">
            Manage rides you are offering and track requests for rides you've joined
          </p>
        </div>

        <Link
          to="/post-ride"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Ride</span>
        </Link>
      </div>

      {actionMsg.text && (
        <div
          className={`flex items-center space-x-2 text-sm p-3.5 rounded-xl border ${
            actionMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-red-50 text-red-700 border-red-100'
          }`}
        >
          {actionMsg.type === 'success' ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 flex space-x-8">
        <button
          onClick={() => setActiveTab('driving')}
          className={`pb-4 text-sm font-semibold transition border-b-2 flex items-center space-x-2 ${
            activeTab === 'driving'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Rides I'm Driving ({offeredRides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-4 text-sm font-semibold transition border-b-2 flex items-center space-x-2 ${
            activeTab === 'bookings'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>My Join Requests ({riderRequests.length})</span>
        </button>
      </div>

      {/* Tab 1: Rides I'm Driving */}
      {activeTab === 'driving' && (
        <div className="space-y-8">
          {/* Section: Incoming Passenger Requests */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Incoming Passenger Requests ({driverRequests.filter((r) => r.status === 'pending').length} pending)
            </h2>

            {driverRequests.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No incoming passenger requests at the moment.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {driverRequests.map((req) => (
                  <div
                    key={req._id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-gray-900">
                          {req.rider?.name}
                        </span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                            req.status === 'accepted'
                              ? 'bg-emerald-50 text-emerald-700'
                              : req.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Requested <strong className="text-gray-700">{req.seatsRequested} seat(s)</strong> for{' '}
                        {req.ride?.origin} &rarr; {req.ride?.destination}
                      </p>
                      {req.message && (
                        <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg italic">
                          "{req.message}"
                        </p>
                      )}
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRespondRequest(req._id, 'accepted')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleRespondRequest(req._id, 'rejected')}
                          className="px-3.5 py-1.5 bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-600 text-xs font-semibold rounded-lg transition flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Offered Rides List */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">My Posted Rides</h2>
            {offeredRides.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-3">
                <Car className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-sm text-gray-500">You haven't posted any rides yet.</p>
                <Link
                  to="/post-ride"
                  className="inline-block text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Create your first ride &rarr;
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {offeredRides.map((ride) => (
                  <div
                    key={ride._id}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-gray-900">
                          {ride.origin} &rarr; {ride.destination}
                        </h4>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span>{new Date(ride.departureDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{ride.departureTime}</span>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                          ride.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {ride.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-gray-400">Available:</span>{' '}
                        <strong className="text-indigo-600">{ride.availableSeats} of {ride.totalSeats} seats</strong>
                      </div>
                      <div>
                        <span className="text-gray-400">Price / Seat:</span>{' '}
                        <strong className="text-emerald-600">₹{ride.pricePerSeat}</strong>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <Link
                        to={`/rides/${ride._id}`}
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        View Full Details &rarr;
                      </Link>
                      {ride.status === 'active' && (
                        <button
                          onClick={() => handleCancelRide(ride._id)}
                          className="text-xs font-semibold text-rose-600 hover:underline"
                        >
                          Cancel Ride
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: My Bookings & Requests */}
      {activeTab === 'bookings' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900">My Submitted Ride Requests</h2>

          {riderRequests.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm text-gray-500">You haven't requested to join any rides yet.</p>
              <Link
                to="/search-rides"
                className="inline-block text-xs font-semibold text-indigo-600 hover:underline"
              >
                Search available rides &rarr;
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {riderRequests.map((req) => (
                <div
                  key={req._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-gray-900">
                        {req.ride?.origin} &rarr; {req.ride?.destination}
                      </h4>
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                          req.status === 'accepted'
                            ? 'bg-emerald-50 text-emerald-700'
                            : req.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700'
                            : req.status === 'cancelled'
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 text-xs text-gray-500">
                      <span>Driver: {req.driver?.name}</span>
                      <span>•</span>
                      <span>
                        Date: {req.ride ? new Date(req.ride.departureDate).toLocaleDateString() : 'N/A'} at{' '}
                        {req.ride?.departureTime}
                      </span>
                      <span>•</span>
                      <span>Requested: {req.seatsRequested} seat(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {req.status === 'pending' && (
                      <button
                        onClick={() => handleCancelRequest(req._id)}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        Cancel Request
                      </button>
                    )}
                    {req.ride?._id && (
                      <Link
                        to={`/rides/${req.ride._id}`}
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        Ride Details &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyRides;
