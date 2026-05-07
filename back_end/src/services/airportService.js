const { Airport } = require('../models');

class AirportService {
  async getAll() {
    return await Airport.findAll();
  }

  async getById(id) {
    const airport = await Airport.findByPk(id);
    if (!airport) throw new Error('Aeropuerto no encontrado');
    return airport;
  }
}

module.exports = new AirportService();
