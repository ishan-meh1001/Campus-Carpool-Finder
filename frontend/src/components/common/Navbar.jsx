import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Car,
  User,
  LogOut,
  PlusCircle,
  Search,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Campus Carpool
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/search-rides"
                  className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition"
                >
                  <Search className="w-4 h-4" />
                  <span>Find a Ride</span>
                </Link>
                <Link
                  to="/my-rides"
                  className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition"
                >
                  <Car className="w-4 h-4" />
                  <span>My Rides</span>
                </Link>
                <Link
                  to="/post-ride"
                  className="flex items-center space-x-1.5 px-3.5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Ride</span>
                </Link>
                <Link
                  to="/notifications"
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* User Menu */}
                <div className="flex items-center pl-3 border-l border-gray-200 space-x-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-800 max-w-[120px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-lg transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-1">
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 border-b border-gray-100 mb-2">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <LayoutDashboard className="w-5 h-5 text-gray-500" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/search-rides"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <Search className="w-5 h-5 text-gray-500" />
                <span>Find a Ride</span>
              </Link>
              <Link
                to="/my-rides"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <Car className="w-5 h-5 text-gray-500" />
                <span>My Rides</span>
              </Link>
              <Link
                to="/post-ride"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-indigo-600 font-semibold hover:bg-indigo-50 rounded-md"
              >
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                <span>Post a Ride</span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <User className="w-5 h-5 text-gray-500" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                <LogOut className="w-5 h-5" />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
