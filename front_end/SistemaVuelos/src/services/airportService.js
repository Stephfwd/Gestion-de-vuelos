import axiosClient from './axiosClient';

const airportService = {
  getAll: async () => {
    const response = await axiosClient.get('/airports');
    return response.data;
  }
};

export default airportService;
