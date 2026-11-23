import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import {
  ShieldCheck,
  Users,
  Car,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Search,
  Star,
  DollarSign,
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics', 'users', 'rides'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, ridesRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAllUsers(),
        adminService.getAllRides(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users);
      if (ridesRes.success) setRides(ridesRes.rides);
    } catch (err) {
      console.error('Failed to load admin portal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this student account and remove all their rides?')) return;
    try {
      const res = await adminService.deleteUser(userId);
      if (res.success) {
        setMessage({ type: 'success', text: 'User removed from platform.' });
        loadData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete user.' });
    }
  };

  const handleDeleteRide = async (rideId) => {
    if (!window.confirm('Delete this ride posting permanently?')) return;
    try {
      const res = await adminService.deleteRide(rideId);
      if (res.success) {
        setMessage({ type: 'success', text: 'Ride removed by moderator.' });
        loadData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete ride.' });
    }
  };

  const handleSearchUsers = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await adminService.getAllUsers(searchTerm);
      if (res.success) setUsers(res.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campus Moderator Portal</h1>
            <p className="text-xs text-gray-500">
              Administrative oversight, verification monitoring, and platform integrity
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 p-1 rounded-xl space-x-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'metrics' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'users' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Students ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('rides')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'rides' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Rides ({rides.length})
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-red-50 text-red-700 border-red-100'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tab 1: Overview Metrics */}
      {activeTab === 'metrics' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium">Registered Students</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium">Total Rides Posted</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRides}</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium">Active Rides</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats.activeRides}</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium">Total Requests</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRequests}</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium">Accepted Bookings</p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-1">{stats.acceptedRequests}</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium">Reviews Submitted</p>
            <h3 className="text-2xl font-bold text-amber-500 mt-1">{stats.totalRatings}</h3>
          </div>
        </div>
      )}

      {/* Tab 2: User Moderation */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <form onSubmit={handleSearchUsers} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, email, or roll..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
            >
              Filter
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 uppercase text-gray-400 tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">College ID</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-gray-600">{u.collegeId || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{u.ratingAverage ? u.ratingAverage.toFixed(1) : '5.0'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Ride Moderation */}
      {activeTab === 'rides' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 uppercase text-gray-400 tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Seats</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rides.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {r.origin} &rarr; {r.destination}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {r.driver?.name} ({r.driver?.email})
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(r.departureDate).toLocaleDateString()} {r.departureTime}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {r.availableSeats} of {r.totalSeats}
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">
                      ₹{r.pricePerSeat}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        r.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteRide(r._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Ride"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
