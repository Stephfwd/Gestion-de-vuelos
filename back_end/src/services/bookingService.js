const { Booking, Flight, Airport } = require('../models');
const { sequelize } = require('../config/database');

class BookingService {
  async create(usuario_id, bookingData) {
    const t = await sequelize.transaction();
    try {
      const { vuelo_id, cantidad_asientos } = bookingData;

      const flight = await Flight.findByPk(vuelo_id, { transaction: t });
      if (!flight) throw new Error('Vuelo no encontrado');

      if (flight.asientos_disponibles < cantidad_asientos) {
        throw new Error('No hay suficientes asientos disponibles');
      }

      const booking = await Booking.create({
        usuario_id,
        vuelo_id,
        cantidad_asientos,
        estado: 'Pendiente'
      }, { transaction: t });

      await flight.update({
        asientos_disponibles: flight.asientos_disponibles - cantidad_asientos
      }, { transaction: t });

      await t.commit();
      return booking;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getByUser(usuario_id) {
    return await Booking.findAll({
      where: { usuario_id },
      include: [
        { 
          model: Flight, 
          as: 'vuelo',
          include: [
            { model: Airport, as: 'origen' },
            { model: Airport, as: 'destino' }
          ]
        }
      ]
    });
  }

  async cancel(id) {
    const t = await sequelize.transaction();
    try {
      const booking = await Booking.findByPk(id, { transaction: t });
      if (!booking) throw new Error('Reserva no encontrada');
      if (booking.estado === 'Cancelada') throw new Error('La reserva ya está cancelada');

      const flight = await Flight.findByPk(booking.vuelo_id, { transaction: t });
      await flight.update({
        asientos_disponibles: flight.asientos_disponibles + booking.cantidad_asientos
      }, { transaction: t });

      await booking.update({ estado: 'Cancelada' }, { transaction: t });

      await t.commit();
      return { message: 'Reserva cancelada exitosamente' };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = new BookingService();
