import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rideService } from '../services/rideService';
import { requestService } from '../services/requestService';
import RatingModal from '../components/rides/RatingModal';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  Car,
  Star,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Send,
} from 'lucide-react';

const RideDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seatsRequested, setSeatsRequested] = useState(1);
  const [message, setMessage] = useState('');
  const [requestStatus, setRequestStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [ratingTarget, setRatingTarget] = useState(null); // User to rate in modal

  useEffect(() => {
    const fetchRide = async () => {
      try {
        setLoading(true);
        const res = await rideService.getRideById(id);
        if (res.success) {
          setRide(res.ride);
        }
      } catch (err) {
        console.error('Error fetching ride:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [id]);

  const handleJoinRequest = async (e) => {
    e.preventDefault();
    setRequestStatus({ type: '', text: '' });

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      const res = await requestService.createRequest({
        rideId: ride._id,
        seatsRequested: Number(seatsRequested),
        message,
      });

      if (res.success) {
        setRequestStatus({
          type: 'success',
          text: 'Ride request sent successfully! Driver will review your request.',
        });
      }
    } catch (err) {
      setRequestStatus({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit ride request.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Loading ride details...</p>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Ride not found</h2>
        <p className="text-gray-500 text-sm">The ride you are looking for does not exist or has been cancelled.</p>
        <Link to="/search-rides" className="inline-block text-indigo-600 font-semibold text-sm">
          &larr; Back to Search
        </Link>
      </div>
    );
  }

  const isOwnRide = user?.id === ride.driver?._id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <Link
        to="/search-rides"
        className="inline-flex items-center space-x-1 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to search results</span>
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Journey Details Left Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                ride.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {ride.status}
              </span>
              <span className="text-xs text-gray-400">
                Posted {new Date(ride.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Route */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-3.5 h-3.5 rounded-full bg-indigo-600 mt-1 flex-shrink-0"></div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Pickup Origin</p>
                  <p className="text-base font-semibold text-gray-900">{ride.origin}</p>
                </div>
              </div>

              <div className="ml-1.5 pl-4 border-l-2 border-dashed border-gray-200 py-1"></div>

              <div className="flex items-start space-x-3">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-500 mt-1 flex-shrink-0"></div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Dropoff Destination</p>
                  <p className="text-base font-semibold text-gray-900">{ride.destination}</p>
                </div>
              </div>
            </div>

            {/* Timings & Seat Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-medium">Departure Date</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                  {new Date(ride.departureDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium">Departure Time</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{ride.departureTime}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium">Available Seats</p>
                <p className="text-sm font-bold text-indigo-600 mt-0.5">
                  {ride.availableSeats} of {ride.totalSeats}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium">Cost per Seat</p>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">
                  {ride.pricePerSeat === 0 ? 'Free' : `₹${ride.pricePerSeat}`}
                </p>
              </div>
            </div>

            {/* Notes */}
            {ride.notes && (
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Driver Notes
                </h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {ride.notes}
                </p>
              </div>
            )}
          </div>

          {/* Vehicle & Passengers Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Vehicle Specifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-gray-400">Make / Brand</p>
                <p className="font-semibold text-gray-800 mt-0.5">{ride.vehicle?.make || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-gray-400">Model</p>
                <p className="font-semibold text-gray-800 mt-0.5">{ride.vehicle?.model || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-gray-400">License Plate</p>
                <p className="font-semibold text-gray-800 mt-0.5">{ride.vehicle?.licensePlate || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-gray-400">Color</p>
                <p className="font-semibold text-gray-800 mt-0.5">{ride.vehicle?.color || 'N/A'}</p>
              </div>
            </div>

            {/* Confirmed Co-Passengers */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Confirmed Co-Passengers ({ride.confirmedPassengers?.length || 0})
              </h4>
              {ride.confirmedPassengers?.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No passengers joined yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {ride.confirmedPassengers.map((pass) => (
                    <div
                      key={pass._id}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{pass.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Driver Info & Request Form */}
        <div className="space-y-6">
          {/* Driver Profile Summary */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Offered By
            </h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold text-base flex items-center justify-center">
                {ride.driver?.name?.charAt(0) || 'D'}
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">{ride.driver?.name}</h4>
                <div className="flex items-center space-x-1 text-xs text-gray-500 mt-0.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-gray-700">
                    {ride.driver?.ratingAverage?.toFixed(1) || '5.0'}
                  </span>
                  <span>({ride.driver?.ratingCount || 0} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Verified Campus Student</span>
            </div>

            {/* Rate Driver Button (Eligible for passengers) */}
            {isAuthenticated && !isOwnRide && ride.confirmedPassengers?.some(p => p._id === user?.id) && (
              <button
                type="button"
                onClick={() => setRatingTarget(ride.driver)}
                className="w-full mt-2 py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-xl border border-amber-200 transition flex items-center justify-center space-x-1.5"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>Rate Driver</span>
              </button>
            )}
          </div>

          {/* Join Request Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900">Request to Join</h3>

            {requestStatus.text && (
              <div
                className={`flex items-start space-x-2 text-xs p-3 rounded-xl border ${
                  requestStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : 'bg-red-50 text-red-700 border-red-100'
                }`}
              >
                {requestStatus.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                )}
                <span>{requestStatus.text}</span>
              </div>
            )}

            {isOwnRide ? (
              <div className="p-4 bg-indigo-50 text-indigo-700 text-xs rounded-xl font-medium text-center">
                You are the driver of this ride. Manage incoming requests from your dashboard.
              </div>
            ) : ride.availableSeats <= 0 ? (
              <div className="p-4 bg-gray-100 text-gray-600 text-xs rounded-xl font-medium text-center">
                This ride is fully booked. No seats remaining.
              </div>
            ) : ride.status !== 'active' ? (
              <div className="p-4 bg-red-50 text-red-600 text-xs rounded-xl font-medium text-center">
                This ride has been cancelled.
              </div>
            ) : (
              <form onSubmit={handleJoinRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Number of Seats
                  </label>
                  <select
                    value={seatsRequested}
                    onChange={(e) => setSeatsRequested(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {[...Array(ride.availableSeats)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Seat' : 'Seats'} (Total: ₹{(i + 1) * ride.pricePerSeat})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Message to Driver
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Carrying a backpack, waiting near Gate 1"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 disabled:opacity-50 transition flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Request...' : 'Send Join Request'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      {/* Rating Modal */}
      {ratingTarget && (
        <RatingModal
          isOpen={!!ratingTarget}
          onClose={() => setRatingTarget(null)}
          rideId={ride._id}
          targetUser={ratingTarget}
          onRatingSubmitted={() => {
            setRequestStatus({
              type: 'success',
              text: `Thank you! Your rating for ${ratingTarget.name} has been recorded.`,
            });
          }}
        />
      )}
    </div>
  );
};

export default RideDetails;
