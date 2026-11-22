import API from './api';

export const requestService = {
  // Submit request to join a ride
  createRequest: async (requestData) => {
    const response = await API.post('/requests', requestData);
    return response.data;
  },

  // Driver view: get incoming requests for driver's rides
  getDriverRequests: async () => {
    const response = await API.get('/requests/driver');
    return response.data;
  },

  // Rider view: get requests made by logged in student
  getRiderRequests: async () => {
    const response = await API.get('/requests/rider');
    return response.data;
  },

  // Driver accept or reject request
  respondToRequest: async (requestId, status) => {
    const response = await API.put(`/requests/${requestId}/status`, { status });
    return response.data;
  },

  // Rider cancel a request
  cancelRequest: async (requestId) => {
    const response = await API.put(`/requests/${requestId}/cancel`);
    return response.data;
  },
};
