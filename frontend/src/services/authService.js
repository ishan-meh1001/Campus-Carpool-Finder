import API from './api';

export const authService = {
  // Register a new student account
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  // Log in with email and password
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },

  // Get currently logged-in user profile
  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  // Update profile details
  updateProfile: async (profileData) => {
    const response = await API.put('/users/profile', profileData);
    return response.data;
  },

  // Update vehicle details
  updateVehicle: async (vehicleData) => {
    const response = await API.put('/users/vehicle', vehicleData);
    return response.data;
  },
};
