import API from './api';

export const ratingService = {
  createRating: async (ratingData) => {
    const response = await API.post('/ratings', ratingData);
    return response.data;
  },

  getUserRatings: async (userId) => {
    const response = await API.get(`/ratings/user/${userId}`);
    return response.data;
  },
};
