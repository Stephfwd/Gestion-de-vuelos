const flightService = require('../services/flightService');

exports.getAllFlights = async (req, res) => {
  try {
    const flights = await flightService.getAll(req.query);
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFlightById = async (req, res) => {
  try {
    const flight = await flightService.getById(req.params.id);
    res.json(flight);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.createFlight = async (req, res) => {
  try {
    const newFlight = await flightService.create(req.body);
    res.status(201).json(newFlight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const flight = await flightService.update(req.params.id, req.body);
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
