const { Airport } = require('../models');

exports.getAllAirports = async (req, res) => {
  try {
    const airports = await Airport.findAll();
    res.json(airports);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener aeropuertos', error: error.message });
  }
};

exports.getAirportById = async (req, res) => {
  try {
    const airport = await Airport.findByPk(req.params.id);
    if (!airport) return res.status(404).json({ message: 'Aeropuerto no encontrado' });
    res.json(airport);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener aeropuerto', error: error.message });
  }
};
