const { Flight, Airport } = require('../models');
const { Op } = require('sequelize');

class FlightService {
  async getAll(filters = {}) {
    const { origen_id, destino_id, fecha } = filters;
    const where = {};

    if (origen_id) where.origen_id = origen_id;
    if (destino_id) where.destino_id = destino_id;
    if (fecha) {
      where.fecha_salida = {
        [Op.gte]: new Date(fecha),
        [Op.lt]: new Date(new Date(fecha).setDate(new Date(fecha).getDate() + 1))
      };
    }

    return await Flight.findAll({
      where,
      include: [
        { model: Airport, as: 'origen' },
        { model: Airport, as: 'destino' }
      ]
    });
  }

  async getById(id) {
    const flight = await Flight.findByPk(id, {
      include: [
        { model: Airport, as: 'origen' },
        { model: Airport, as: 'destino' }
      ]
    });
    if (!flight) throw new Error('Vuelo no encontrado');
    return flight;
  }

  async create(flightData) {
    return await Flight.create(flightData);
  }

  async update(id, flightData) {
    const flight = await this.getById(id);
    return await flight.update(flightData);
  }
}

module.exports = new FlightService();
