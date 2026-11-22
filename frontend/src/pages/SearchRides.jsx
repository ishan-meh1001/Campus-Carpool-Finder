import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rideService } from '../services/rideService';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Clock,
  Car,
  Star,
  ArrowRight,
  Filter,
} from 'lucide-react';

const SearchRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    date: '',
    seats: '',
  });

  const fetchRides = async (queryFilters = filters) => {
    try {
      setLoading(true);
      const params = {};
      if (queryFilters.origin) params.origin = queryFilters.origin;
      if (queryFilters.destination) params.destination = queryFilters.destination;
      if (queryFilters.date) params.date = queryFilters.date;
      if (queryFilters.seats) params.seats = queryFilters.seats;

      const res = await rideService.getRides(params);
      if (res.success) {
        setRides(res.rides);
      }
    } catch (error) {
      console.error('Failed to load rides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRides();
  };

  const handleReset = () => {
    const emptyFilters = { origin: '', destination: '', date: '', seats: '' };
    setFilters(emptyFilters);
    fetchRides(emptyFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">Find a Campus Ride</h1>
        <p className="text-sm text-gray-500">
          Discover verified student carpools matching your campus commute schedule
        </p>
      </div>

      {/* Filter / Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
      >
        <div className="relative">
          <MapPin className="w-4 h-4 text-indigo-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="origin"
            placeholder="From (Origin)"
            value={filters.origin}
            onChange={handleFilterChange}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="relative">
          <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="destination"
            placeholder="To (Destination)"
            value={filters.destination}
            onChange={handleFilterChange}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="relative">
          <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="relative">
          <Users className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="number"
            min="1"
            name="seats"
            placeholder="Min Seats"
            value={filters.seats}
            onChange={handleFilterChange}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm transition"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition"
            title="Reset Filters"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Rides Results Section */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Searching for carpools...</p>
        </div>
      ) : rides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No matching rides found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Try adjusting your search filters or be the first to offer a ride along this route!
          </p>
          <Link
            to="/post-ride"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition"
          >
            <span>Offer a Ride</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rides.map((ride) => (
            <div
              key={ride._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                {/* Route Header */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0"></div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 uppercase font-semibold">From</p>
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {ride.origin}
                      </h4>
                    </div>
                  </div>

                  <div className="ml-1 pl-3 border-l-2 border-dashed border-gray-200 py-1"></div>

                  <div className="flex items-start space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 uppercase font-semibold">To</p>
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {ride.destination}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Timing & Seats Details */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(ride.departureDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{ride.departureTime}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold text-indigo-700">
                      {ride.availableSeats} of {ride.totalSeats} seats left
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 font-bold text-gray-900">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                    <span>{ride.pricePerSeat === 0 ? 'Free' : `₹${ride.pricePerSeat}`}</span>
                  </div>
                </div>

                {/* Driver Tag */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {ride.driver?.name?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        {ride.driver?.name}
                      </p>
                      <div className="flex items-center space-x-1 text-[11px] text-gray-500">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{ride.driver?.ratingAverage?.toFixed(1) || '5.0'}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">
                    {ride.vehicle?.model || 'Vehicle'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-5 pb-5">
                <Link
                  to={`/rides/${ride._id}`}
                  className="w-full inline-flex items-center justify-center space-x-1.5 py-2.5 bg-gray-50 hover:bg-indigo-600 hover:text-white text-indigo-600 font-semibold text-xs rounded-xl border border-indigo-100 hover:border-transparent transition"
                >
                  <span>View Details & Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchRides;
