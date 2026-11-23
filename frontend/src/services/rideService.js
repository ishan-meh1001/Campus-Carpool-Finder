import API from './api';

export const rideService = {
  // Post a new ride
  createRide: async (rideData) => {
    const response = await API.post('/rides', rideData);
    return response.data;
  },

  // Search and filter rides
  getRides: async (params = {}) => {
    const response = await API.get('/rides', { params });
    return response.data;
  },

  // Get specific ride details by ID
  getRideById: async (id) => {
    const response = await API.get(`/rides/${id}`);
    return response.data;
  },

  // Get rides offered by logged in driver
  getMyOfferedRides: async () => {
    const response = await API.get('/rides/user/my-rides');
    return response.data;
  },

  // Mark ride as completed
  completeRide: async (id) => {
    const response = await API.put(`/rides/${id}/complete`);
    return response.data;
  },

  // Cancel a ride
  cancelRide: async (id) => {
    const response = await API.put(`/rides/${id}/cancel`);
    return response.data;
  },
};
