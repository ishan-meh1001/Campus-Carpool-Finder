import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Car,
  Search,
  PlusCircle,
  User,
  Star,
  ShieldCheck,
  Calendar,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium">
              Verified Student
            </span>
            {user?.role === 'admin' && (
              <span className="px-3 py-1 bg-amber-400 text-gray-900 rounded-full text-xs font-semibold">
                Admin
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Hello, {user?.name}!
          </h1>
          <p className="text-indigo-100 text-sm max-w-xl">
            Welcome to your carpool portal. Search for upcoming rides to campus or post seats in your vehicle to share fuel costs.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/search-rides"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white text-indigo-700 font-semibold text-sm rounded-xl hover:bg-indigo-50 shadow-sm transition"
          >
            <Search className="w-4 h-4" />
            <span>Find a Ride</span>
          </Link>
          <Link
            to="/post-ride"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-500 text-white font-semibold text-sm rounded-xl hover:bg-indigo-400 border border-white/20 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Ride</span>
          </Link>
        </div>
      </div>

      {/* User Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Community Rating</p>
            <div className="flex items-center space-x-1 mt-1">
              <span className="text-2xl font-bold text-gray-900">
                {user?.ratingAverage ? user.ratingAverage.toFixed(1) : '5.0'}
              </span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Based on {user?.ratingCount || 0} reviews
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Registered Vehicle</p>
            <h3 className="text-lg font-bold text-gray-900 mt-1">
              {user?.vehicleDetails?.model || 'No Vehicle Added'}
            </h3>
            <p className="text-xs text-indigo-600 font-medium mt-1">
              {user?.vehicleDetails?.model ? user.vehicleDetails.licensePlate : 'Add in Profile'}
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Student ID</p>
            <h3 className="text-lg font-bold text-gray-900 mt-1">
              {user?.collegeId || 'Not specified'}
            </h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">Verified Status</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Quick Profile</p>
            <h3 className="text-lg font-bold text-gray-900 mt-1">Manage Info</h3>
            <Link to="/profile" className="text-xs text-indigo-600 hover:underline font-medium mt-1 block">
              Edit Details &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Need a Ride?</h3>
              <p className="text-xs text-gray-500">Search for available carpools heading to or from campus.</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Filter by origin, destination, time, and number of seats. Send an instant request to join with fair cost sharing.
          </p>
          <Link
            to="/search-rides"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <span>Search available rides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Driving to Campus?</h3>
              <p className="text-xs text-gray-500">Offer your empty seats and split fuel expenses.</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Publish your route, departure time, and price per seat. Review and accept incoming student requests.
          </p>
          <Link
            to="/post-ride"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-violet-600 hover:text-violet-800"
          >
            <span>Post a new ride</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
