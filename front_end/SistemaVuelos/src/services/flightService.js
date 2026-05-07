import axiosClient from './axiosClient';

const flightService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axiosClient.get(`/flights?${params.toString()}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await axiosClient.get(`/flights/${id}`);
    return response.data;
  },
  create: async (flightData) => {
    const response = await axiosClient.post('/flights', flightData);
    return response.data;
  },
  update: async (id, flightData) => {
    const response = await axiosClient.put(`/flights/${id}`, flightData);
    return response.data;
  }
};

export default flightService;
