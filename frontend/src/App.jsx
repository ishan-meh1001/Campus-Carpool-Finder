import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Sprint 1 Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Sprint 2 Pages
import SearchRides from './pages/SearchRides';
import PostRide from './pages/PostRide';
import RideDetails from './pages/RideDetails';
import MyRides from './pages/MyRides';

// Sprint 3 Pages
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Sprint 2 Routes */}
          <Route path="/search-rides" element={<SearchRides />} />
          <Route path="/rides/:id" element={<RideDetails />} />
          <Route
            path="/post-ride"
            element={
              <ProtectedRoute>
                <PostRide />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-rides"
            element={
              <ProtectedRoute>
                <MyRides />
              </ProtectedRoute>
            }
          />
          {/* Sprint 3 Routes */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
