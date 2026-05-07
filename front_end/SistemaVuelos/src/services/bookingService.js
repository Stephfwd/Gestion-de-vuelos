import axiosClient from './axiosClient';

const bookingService = {
  create: async (bookingData) => {
    const response = await axiosClient.post('/bookings', bookingData);
    return response.data;
  },
  getMyBookings: async () => {
    const response = await axiosClient.get('/bookings/my-bookings');
    return response.data;
  },
  cancel: async (id) => {
    const response = await axiosClient.post(`/bookings/cancel/${id}`);
    return response.data;
  }
};

export default bookingService;
