const { Flight, Airport } = require('../models');
const { Op } = require('sequelize');

exports.getAllFlights = async (req, res) => {
  try {
    const { origen_id, destino_id, fecha } = req.query;
    const where = {};

    if (origen_id) where.origen_id = origen_id;
    if (destino_id) where.destino_id = destino_id;
    if (fecha) {
      where.fecha_salida = {
        [Op.gte]: new Date(fecha),
        [Op.lt]: new Date(new Date(fecha).setDate(new Date(fecha).getDate() + 1))
      };
    }

    const flights = await Flight.findAll({
      where,
      include: [
        { model: Airport, as: 'origen' },
        { model: Airport, as: 'destino' }
      ]
    });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener vuelos', error: error.message });
  }
};

exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id, {
      include: [
        { model: Airport, as: 'origen' },
        { model: Airport, as: 'destino' }
      ]
    });
    if (!flight) return res.status(404).json({ message: 'Vuelo no encontrado' });
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el vuelo', error: error.message });
  }
};

exports.createFlight = async (req, res) => {
  try {
    const newFlight = await Flight.create(req.body);
    res.status(201).json(newFlight);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el vuelo', error: error.message });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Vuelo no encontrado' });
    
    await flight.update(req.body);
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el vuelo', error: error.message });
  }
};
