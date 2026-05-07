const airportService = require('../services/airportService');

exports.getAllAirports = async (req, res) => {
  try {
    const airports = await airportService.getAll();
    res.json(airports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAirportById = async (req, res) => {
  try {
    const airport = await airportService.getById(req.params.id);
    res.json(airport);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
