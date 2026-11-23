import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rideService } from '../services/rideService';
import {
  Car,
  MapPin,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  FileText,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';

const PostRide = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    totalSeats: user?.vehicleDetails?.capacity || 3,
    pricePerSeat: 50,
    notes: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.origin || !formData.destination || !formData.departureDate || !formData.departureTime) {
      setError('Please provide origin, destination, date, and time.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await rideService.createRide(formData);
      if (res.success) {
        navigate('/my-rides');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post ride. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">Offer a Campus Ride</h1>
        <p className="text-sm text-gray-500">
          Share your journey with fellow campus peers and split fuel expenses
        </p>
      </div>

      {error && (
        <div className="flex items-center space-x-2 bg-red-50 text-red-700 text-sm p-3.5 rounded-xl border border-red-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Driver Vehicle Notification Banner */}
      <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Active Vehicle: {user?.vehicleDetails?.model || 'Standard Car'}
            </h4>
            <p className="text-xs text-gray-500">
              {user?.vehicleDetails?.licensePlate
                ? `License: ${user.vehicleDetails.licensePlate} (${user.vehicleDetails.color})`
                : 'Vehicle details will be saved with this ride'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="text-xs font-semibold text-indigo-600 hover:underline"
        >
          Edit Vehicle &rarr;
        </button>
      </div>

      {/* Ride Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Starting Location (Pickup) *
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="e.g. North Campus Metro / Sector 18"
                required
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Destination (Drop-off) *
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g. Main Campus Gate 2 / Academic Block"
                required
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Departure Time *
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                placeholder="e.g. 08:30 AM"
                required
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Available Seats *
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                name="totalSeats"
                min="1"
                max="7"
                value={formData.totalSeats}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Price / Seat (₹)
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                name="pricePerSeat"
                min="0"
                value={formData.pricePerSeat}
                onChange={handleChange}
                placeholder="0 for free"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Additional Notes & Route Details
          </label>
          <div className="relative">
            <FileText className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. AC available, leaving promptly at 8:30 AM, trunk space available for bags."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 disabled:opacity-50 transition flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{submitting ? 'Publishing Ride...' : 'Publish Ride'}</span>
        </button>
      </form>
    </div>
  );
};

export default PostRide;
