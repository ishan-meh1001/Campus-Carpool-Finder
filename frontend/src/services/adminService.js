import API from './api';

export const adminService = {
  getStats: async () => {
    const response = await API.get('/admin/stats');
    return response.data;
  },

  getAllUsers: async (search = '') => {
    const response = await API.get('/admin/users', {
      params: search ? { search } : {},
    });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await API.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getAllRides: async () => {
    const response = await API.get('/admin/rides');
    return response.data;
  },

  deleteRide: async (rideId) => {
    const response = await API.delete(`/admin/rides/${rideId}`);
    return response.data;
  },
};
