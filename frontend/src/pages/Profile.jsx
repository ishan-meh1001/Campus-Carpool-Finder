import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { User, Car, CheckCircle, AlertCircle, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();

  // Personal Info Form State
  const [personalData, setPersonalData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    collegeId: user?.collegeId || '',
  });

  // Vehicle Form State
  const [vehicleData, setVehicleData] = useState({
    make: user?.vehicleDetails?.make || '',
    model: user?.vehicleDetails?.model || '',
    licensePlate: user?.vehicleDetails?.licensePlate || '',
    color: user?.vehicleDetails?.color || '',
    capacity: user?.vehicleDetails?.capacity || 3,
  });

  const [personalMsg, setPersonalMsg] = useState({ type: '', text: '' });
  const [vehicleMsg, setVehicleMsg] = useState({ type: '', text: '' });
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingVehicle, setSavingVehicle] = useState(false);

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setPersonalMsg({ type: '', text: '' });
    try {
      setSavingPersonal(true);
      const res = await authService.updateProfile(personalData);
      if (res.success) {
        updateUser(res.user);
        setPersonalMsg({ type: 'success', text: 'Personal details updated successfully.' });
      }
    } catch (err) {
      setPersonalMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update personal profile.',
      });
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    setVehicleMsg({ type: '', text: '' });
    try {
      setSavingVehicle(true);
      const res = await authService.updateVehicle(vehicleData);
      if (res.success) {
        updateUser({ vehicleDetails: res.vehicleDetails });
        setVehicleMsg({ type: 'success', text: 'Vehicle information saved successfully.' });
      }
    } catch (err) {
      setVehicleMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to save vehicle details.',
      });
    } finally {
      setSavingVehicle(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Profile & Vehicle</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your student information and vehicle details for posting rides
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Section 1: Personal Details */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Personal Information</h2>
              <p className="text-xs text-gray-500">Your campus identification details</p>
            </div>
          </div>

          {personalMsg.text && (
            <div
              className={`flex items-center space-x-2 text-sm p-3 rounded-xl border ${
                personalMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : 'bg-red-50 text-red-700 border-red-100'
              }`}
            >
              {personalMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{personalMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePersonalSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={personalData.name}
                onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                required
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                College Email (Read Only)
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Roll / College ID
              </label>
              <input
                type="text"
                value={personalData.collegeId}
                onChange={(e) => setPersonalData({ ...personalData, collegeId: e.target.value })}
                placeholder="e.g. 21BCSE052"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={personalData.phone}
                onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                placeholder="10-digit mobile"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={savingPersonal}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm disabled:opacity-50 transition"
            >
              <Save className="w-4 h-4" />
              <span>{savingPersonal ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>

        {/* Section 2: Vehicle Information */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Vehicle Details</h2>
              <p className="text-xs text-gray-500">Required if you plan to offer rides to peers</p>
            </div>
          </div>

          {vehicleMsg.text && (
            <div
              className={`flex items-center space-x-2 text-sm p-3 rounded-xl border ${
                vehicleMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : 'bg-red-50 text-red-700 border-red-100'
              }`}
            >
              {vehicleMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{vehicleMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleVehicleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Make / Brand
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maruti Suzuki / Hyundai"
                  value={vehicleData.make}
                  onChange={(e) => setVehicleData({ ...vehicleData, make: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Model Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Swift / i20"
                  value={vehicleData.model}
                  onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                License Plate Number
              </label>
              <input
                type="text"
                placeholder="e.g. DL 01 AB 1234"
                value={vehicleData.licensePlate}
                onChange={(e) => setVehicleData({ ...vehicleData, licensePlate: e.target.value.toUpperCase() })}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Vehicle Color
                </label>
                <input
                  type="text"
                  placeholder="e.g. White / Silver"
                  value={vehicleData.color}
                  onChange={(e) => setVehicleData({ ...vehicleData, color: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Passenger Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={vehicleData.capacity}
                  onChange={(e) => setVehicleData({ ...vehicleData, capacity: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingVehicle}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm rounded-xl shadow-sm disabled:opacity-50 transition"
            >
              <Save className="w-4 h-4" />
              <span>{savingVehicle ? 'Saving...' : 'Save Vehicle'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
